import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { message as antdMessage } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import { getSocket } from '@/services/socketService'
import { chatService } from '@/services/chatService'
import { getActiveQuickReplies, recordQuickReplyUsage } from '@/services/adminQuickRepliesService'
import {
  createClientTempId,
  applyLocalChatReaction,
  getLocalizedSystemMessage,
  isSameOptimisticImageMessage,
  mergeChatReactionUpdate,
  revokeChatImageUrls
} from '@/utils/chatMessage'

import { apiFetch, getMessagePreview, revokePreviewUrl } from '../utils'

const CHAT_TABS = new Set(['unassigned', 'mine', 'open', 'resolved'])
const CONVERSATION_PAGE_SIZE = 30
const SEARCH_DEBOUNCE_MS = 300

function resolveQuickReplyVariables(content, variables = {}) {
  return String(content || '').replace(/{{\s*([a-zA-Z][a-zA-Z0-9_]*)\s*}}/g, (match, key) => {
    const value = variables[key]
    return typeof value === 'string' && value.trim() ? value : match
  })
}

function getValidChatTab(tab) {
  return CHAT_TABS.has(tab) ? tab : 'unassigned'
}

function getConversationStatusFilter(tab) {
  return tab === 'unassigned' || tab === 'resolved' ? tab : 'open'
}

function getConversationTab(conversation, agentId) {
  if (conversation?.status === 'resolved') return 'resolved'
  if (conversation?.status === 'unassigned') return 'unassigned'
  if (conversation?.assignedAgent?.agentId === agentId) return 'mine'
  return 'open'
}

function getConversationSortTime(conversation) {
  return new Date(conversation?.lastMessageAt || conversation?.createdAt || 0).getTime()
}

function sortConversationsByLatest(left, right) {
  return getConversationSortTime(right) - getConversationSortTime(left)
}

function mergeConversationPages(currentConversations, nextConversations) {
  const conversationMap = new Map()

  currentConversations.forEach(conversation => {
    if (conversation?.sessionId) {
      conversationMap.set(conversation.sessionId, conversation)
    }
  })

  nextConversations.forEach(conversation => {
    if (conversation?.sessionId) {
      conversationMap.set(conversation.sessionId, conversation)
    }
  })

  return Array.from(conversationMap.values()).sort(sortConversationsByLatest)
}

function conversationMatchesTab(conversation, tab, agentId) {
  if (tab === 'unassigned') return conversation?.status === 'unassigned'
  if (tab === 'mine') return conversation?.status === 'open' && conversation?.assignedAgent?.agentId === agentId
  if (tab === 'open') return conversation?.status === 'open'
  if (tab === 'resolved') return conversation?.status === 'resolved'
  return true
}

function conversationMatchesSearch(conversation, search) {
  const normalizedSearch = search.trim().toLowerCase()
  if (!normalizedSearch) return true

  return [
    conversation?.customer?.name,
    conversation?.customer?.email,
    conversation?.customer?.currentPage,
    conversation?.sessionId,
    conversation?.lastMessage,
    conversation?.translations?.en?.lastMessage,
    conversation?.assignedAgent?.agentName
  ]
    .filter(Boolean)
    .some(value => String(value).toLowerCase().includes(normalizedSearch))
}

function getPaginationTotal(response) {
  return Number.isFinite(response?.pagination?.total)
    ? response.pagination.total
    : (response?.data || []).length
}

function hasPaginationTotal(response) {
  return Number.isFinite(response?.pagination?.total)
}

export function useAdminChatPage() {
  const { t, i18n } = useTranslation('adminChat')
  const language = i18n.resolvedLanguage || i18n.language
  const quickReplyLanguage = String(language || '').toLowerCase().startsWith('en') ? 'en' : 'vi'
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = getValidChatTab(searchParams.get('tab'))
  const initialSession = searchParams.get('session') || null
  const [activeTab, setActiveTab] = useState(initialTab)
  const [conversations, setConversations] = useState([])
  const [counts, setCounts] = useState({})
  const [selectedSession, setSelectedSession] = useState(initialSession)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isNote, setIsNote] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [customerTyping, setCustomerTyping] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [pendingImage, setPendingImage] = useState(null)
  const [quickReplies, setQuickReplies] = useState([])
  const [quickRepliesLoading, setQuickRepliesLoading] = useState(false)
  const [conversationsLoading, setConversationsLoading] = useState(true)
  const [conversationsLoadingMore, setConversationsLoadingMore] = useState(false)
  const [conversationPagination, setConversationPagination] = useState({
    hasMore: false,
    limit: CONVERSATION_PAGE_SIZE,
    page: 1,
    total: 0
  })
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [resolving, setResolving] = useState(false)

  const messagesViewportRef = useRef(null)
  const inputRef = useRef(null)
  const imageInputRef = useRef(null)
  const typingTimerRef = useRef(null)
  const agentTypingTimerRef = useRef(null)
  const pendingImageRef = useRef(null)
  const previousSessionRef = useRef(null)
  const selectedSessionRef = useRef(null)
  const activeTabRef = useRef(initialTab)
  const agentIdRef = useRef(null)
  const restoredSessionRef = useRef(null)
  const historyRequestRef = useRef(0)
  const conversationsRequestRef = useRef(0)
  const conversationsRef = useRef([])
  const debouncedSearchQueryRef = useRef('')
  const loadConversationsRef = useRef(null)
  const loadCountsRef = useRef(null)

  const admin = useSelector(state => state.adminUser?.user || state.user?.user)
  const websiteConfig = useSelector(state => state.websiteConfig?.data)
  const agentId = admin?._id || null
  const agentName = admin?.fullName || admin?.name || 'Agent'
  const agentAvatar = admin?.avatarUrl || admin?.avatar || null
  const reactionActor = useMemo(() => ({
    reactorType: 'agent',
    reactorId: agentId ? String(agentId) : ''
  }), [agentId])

  const emitAgentTyping = useCallback((isTyping, sessionId = selectedSessionRef.current) => {
    if (!sessionId) return

    getSocket().emit('chat:typing', {
      sessionId,
      isTyping,
      role: 'agent'
    })
  }, [])

  const stopAgentTyping = useCallback((sessionId = selectedSessionRef.current) => {
    clearTimeout(agentTypingTimerRef.current)
    emitAgentTyping(false, sessionId)
  }, [emitAgentTyping])

  const updateChatSearchParams = useCallback((updates = {}) => {
    setSearchParams(prevParams => {
      const nextParams = new URLSearchParams(prevParams)

      if (updates.tab) {
        nextParams.set('tab', getValidChatTab(updates.tab))
      }

      if (Object.prototype.hasOwnProperty.call(updates, 'session')) {
        if (updates.session) {
          nextParams.set('session', updates.session)
        } else {
          nextParams.delete('session')
        }
      }

      return nextParams
    }, { replace: true })
  }, [setSearchParams])

  useEffect(() => {
    const previousSession = selectedSessionRef.current

    if (previousSession && previousSession !== selectedSession) {
      stopAgentTyping(previousSession)
    }

    selectedSessionRef.current = selectedSession
  }, [selectedSession, stopAgentTyping])

  useEffect(() => {
    activeTabRef.current = activeTab
  }, [activeTab])

  useEffect(() => {
    agentIdRef.current = agentId
  }, [agentId])

  useEffect(() => {
    pendingImageRef.current = pendingImage
  }, [pendingImage])

  useEffect(() => {
    conversationsRef.current = conversations
  }, [conversations])

  useEffect(() => {
    debouncedSearchQueryRef.current = debouncedSearchQuery
  }, [debouncedSearchQuery])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim())
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [searchQuery])

  useEffect(() => () => {
    revokePreviewUrl(pendingImageRef.current?.previewUrl)
  }, [])

  useEffect(() => () => {
    stopAgentTyping()
  }, [stopAgentTyping])

  const loadQuickReplies = useCallback(async () => {
    setQuickRepliesLoading(true)

    try {
      const response = await getActiveQuickReplies({ limit: 100, language: quickReplyLanguage })
      setQuickReplies(response?.data || [])
    } catch {
      setQuickReplies([])
    } finally {
      setQuickRepliesLoading(false)
    }
  }, [quickReplyLanguage])

  useEffect(() => {
    void loadQuickReplies()
  }, [loadQuickReplies])

  const loadConversations = useCallback(async ({ append = false, page = 1, silent = false } = {}) => {
    const requestId = conversationsRequestRef.current + 1
    conversationsRequestRef.current = requestId

    if (activeTab === 'mine' && !agentId) {
      setConversations([])
      setConversationPagination({
        hasMore: false,
        limit: CONVERSATION_PAGE_SIZE,
        page: 1,
        total: 0
      })
      setConversationsLoading(false)
      setConversationsLoadingMore(false)
      return
    }

    if (append) {
      setConversationsLoadingMore(true)
    } else if (!silent) {
      setConversationsLoading(true)
    }

    try {
      const params = new URLSearchParams({
        limit: String(CONVERSATION_PAGE_SIZE),
        page: String(page),
        status: getConversationStatusFilter(activeTab)
      })

      if (activeTab === 'mine') {
        params.set('agentId', agentId)
      }

      if (debouncedSearchQuery) {
        params.set('search', debouncedSearchQuery)
      }

      const response = await apiFetch(`chat/conversations?${params.toString()}`)

      if (conversationsRequestRef.current !== requestId) {
        return
      }

      const nextConversations = response.data || []
      const pagination = response.pagination || {}

      setConversationPagination({
        hasMore: Boolean(pagination.hasMore),
        limit: pagination.limit || CONVERSATION_PAGE_SIZE,
        page: pagination.page || page,
        total: Number.isFinite(pagination.total) ? pagination.total : nextConversations.length
      })
      setConversations(prevConversations =>
        append ? mergeConversationPages(prevConversations, nextConversations) : nextConversations
      )
    } catch {
      // Keep the current list visible if refresh fails.
    } finally {
      if (conversationsRequestRef.current === requestId) {
        setConversationsLoading(false)
        setConversationsLoadingMore(false)
      }
    }
  }, [activeTab, agentId, debouncedSearchQuery])

  useEffect(() => {
    loadConversationsRef.current = loadConversations
  }, [loadConversations])

  const loadCounts = useCallback(async () => {
    try {
      const countRequests = [
        apiFetch('chat/conversations?status=unassigned&limit=1&page=1'),
        apiFetch('chat/conversations?status=open&limit=1&page=1'),
        apiFetch('chat/conversations?status=resolved&limit=1&page=1')
      ]

      if (agentId) {
        countRequests.push(apiFetch(`chat/conversations?status=open&agentId=${encodeURIComponent(agentId)}&limit=1&page=1`))
      }

      const [unassignedResponse, openResponse, resolvedResponse, mineResponse] = await Promise.all(countRequests)

      if (
        !hasPaginationTotal(unassignedResponse) ||
        !hasPaginationTotal(openResponse) ||
        !hasPaginationTotal(resolvedResponse) ||
        (agentId && !hasPaginationTotal(mineResponse))
      ) {
        const [legacyUnassignedResponse, legacyOpenResponse, legacyResolvedResponse] = await Promise.all([
          apiFetch('chat/conversations?status=unassigned&limit=1000'),
          apiFetch('chat/conversations?status=open&limit=1000'),
          apiFetch('chat/conversations?status=resolved&limit=1000')
        ])
        const legacyOpenConversations = legacyOpenResponse.data || []

        setCounts({
          unassigned: (legacyUnassignedResponse.data || []).length,
          mine: agentId
            ? legacyOpenConversations.filter(conversation => conversation.assignedAgent?.agentId === agentId).length
            : 0,
          open: legacyOpenConversations.length,
          resolved: (legacyResolvedResponse.data || []).length
        })
        return
      }

      setCounts({
        unassigned: getPaginationTotal(unassignedResponse),
        mine: agentId ? getPaginationTotal(mineResponse) : 0,
        open: getPaginationTotal(openResponse),
        resolved: getPaginationTotal(resolvedResponse)
      })
    } catch {
      // ignore
    }
  }, [agentId])

  useEffect(() => {
    loadCountsRef.current = loadCounts
  }, [loadCounts])

  const loadHistory = useCallback(async sessionId => {
    const requestId = historyRequestRef.current + 1
    historyRequestRef.current = requestId

    setMessagesLoading(true)

    try {
      const response = await apiFetch(`chat/history/${sessionId}?internal=true`)

      if (historyRequestRef.current === requestId) {
        setMessages(response.data || [])
      }
    } catch {
      if (historyRequestRef.current === requestId) {
        setMessages([])
      }
    } finally {
      if (historyRequestRef.current === requestId) {
        setMessagesLoading(false)
      }
    }
  }, [])

  const restoreConversationFromUrl = useCallback(async sessionId => {
    if (!sessionId) {
      return
    }

    try {
      const response = await apiFetch(`chat/conversation/${sessionId}`)
      const conversation = response?.data || null

      if (!conversation) {
        stopAgentTyping(selectedSessionRef.current)
        selectedSessionRef.current = null
        restoredSessionRef.current = null
        setSelectedSession(null)
        setSelectedConversation(null)
        updateChatSearchParams({ session: null })
        return
      }

      const urlTab = searchParams.get('tab')
      const nextTab = urlTab ? getValidChatTab(urlTab) : getConversationTab(conversation, agentId)

      if (selectedSessionRef.current && selectedSessionRef.current !== sessionId) {
        stopAgentTyping(selectedSessionRef.current)
      }

      selectedSessionRef.current = sessionId
      setActiveTab(nextTab)
      setSelectedSession(sessionId)
      setSelectedConversation(conversation)
      setCustomerTyping(false)
      updateChatSearchParams({ tab: nextTab, session: sessionId })
      await loadHistory(sessionId)

      const socket = getSocket()
      socket.emit('chat:join', { sessionId })

      await apiFetch(`chat/read/${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ reader: 'agent' }),
        headers: { 'Content-Type': 'application/json' }
      })
    } catch {
      antdMessage.error(t('errors.restoreConversation'))
    }
  }, [agentId, loadHistory, searchParams, stopAgentTyping, t, updateChatSearchParams])

  useEffect(() => {
    const urlTab = getValidChatTab(searchParams.get('tab'))
    const urlSession = searchParams.get('session') || null

    if (urlTab !== activeTabRef.current) {
      setActiveTab(urlTab)
    }

    if (!urlSession && selectedSessionRef.current) {
      stopAgentTyping(selectedSessionRef.current)
      selectedSessionRef.current = null
      setSelectedSession(null)
      setSelectedConversation(null)
      setMessages([])
      setCustomerTyping(false)
      restoredSessionRef.current = null
      return
    }

    if (urlSession && restoredSessionRef.current !== urlSession) {
      restoredSessionRef.current = urlSession
      void restoreConversationFromUrl(urlSession)
    }
  }, [restoreConversationFromUrl, searchParams, stopAgentTyping])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  useEffect(() => {
    loadCounts()
  }, [loadCounts])

  useEffect(() => {
    const socket = getSocket()

    if (socket.connected) {
      socket.emit('join', { role: 'admin' })
    } else {
      socket.once('connect', () => socket.emit('join', { role: 'admin' }))
    }

    const handleNewConversation = conversation => {
      const currentSearch = debouncedSearchQueryRef.current

      if (
        activeTabRef.current === 'unassigned' &&
        conversationMatchesSearch(conversation, currentSearch)
      ) {
        setConversations(prevConversations => {
          if (prevConversations.find(item => item.sessionId === conversation.sessionId)) {
            return prevConversations
          }

          return [conversation, ...prevConversations].sort(sortConversationsByLatest)
        })
        setConversationPagination(prevPagination => ({
          ...prevPagination,
          total: prevPagination.total + 1
        }))
      } else if (!currentSearch) {
        loadConversationsRef.current?.({ page: 1, silent: true })
      }

      loadCountsRef.current?.()
    }

    const refreshConversationListIfMissing = sessionId => {
      if (debouncedSearchQueryRef.current) {
        return
      }

      const hasConversationLoaded = conversationsRef.current.some(conversation => conversation.sessionId === sessionId)
      if (!hasConversationLoaded) {
        loadConversationsRef.current?.({ page: 1, silent: true })
      }
    }

    const updateMessagesWithSocketPayload = message => {
      if (selectedSessionRef.current !== message.sessionId) {
        return
      }

      setMessages(prevMessages => {
        if (prevMessages.some(item => item._id === message._id)) {
          return prevMessages
        }

        if (message.sender === 'agent' || message.type === 'note' || message.isInternal) {
          const optimisticIndex = prevMessages.findIndex(item =>
            item.isOptimistic &&
            (
              (message.clientTempId && item.clientTempId === message.clientTempId) ||
              (message.type === 'image' && item.type === 'image' && item.imageUrl === message.imageUrl) ||
              (message.type === 'image' && item.type === 'image' && isSameOptimisticImageMessage(item, message)) ||
              ((message.type !== 'image' || !message.imageUrl) && item.message === message.message)
            )
          )

          if (optimisticIndex !== -1) {
            const nextMessages = [...prevMessages]
            revokeChatImageUrls(nextMessages[optimisticIndex])
            nextMessages[optimisticIndex] = message
            return nextMessages
          }
        }

        return [...prevMessages, message]
      })
    }

    const handleNewMessage = message => {
      refreshConversationListIfMissing(message.sessionId)

      setConversations(prevConversations =>
        prevConversations
          .map(conversation =>
            conversation.sessionId === message.sessionId
              ? {
                  ...conversation,
                  lastMessage: getMessagePreview(message, {
                    emptyText: t('message.empty'),
                    imageText: t('message.image'),
                    language,
                    systemText: msg => getLocalizedSystemMessage(msg, t, language)
                  }),
                  lastMessageAt: message.createdAt,
                  lastMessageSender: message.sender,
                  unreadByAgent:
                    selectedSessionRef.current === message.sessionId
                      ? 0
                      : (conversation.unreadByAgent || 0) + (message.sender === 'customer' ? 1 : 0)
                }
              : conversation
          )
          .sort(sortConversationsByLatest)
      )

      updateMessagesWithSocketPayload(message)
    }

    const handleMessage = message => {
      updateMessagesWithSocketPayload(message)
      refreshConversationListIfMissing(message.sessionId)

      if (message.sender !== 'customer') {
        setConversations(prevConversations =>
          prevConversations
            .map(conversation =>
              conversation.sessionId === message.sessionId
                ? {
                    ...conversation,
                    lastMessage: getMessagePreview(message, {
                      emptyText: t('message.empty'),
                      imageText: t('message.image'),
                      language,
                      systemText: msg => getLocalizedSystemMessage(msg, t, language)
                    }),
                    lastMessageAt: message.createdAt,
                    lastMessageSender: message.sender
                  }
                : conversation
            )
            .sort(sortConversationsByLatest)
        )
      }

      if (selectedSessionRef.current !== message.sessionId && message.sender === 'customer') {
        setConversations(prevConversations =>
          prevConversations.map(conversation =>
            conversation.sessionId === message.sessionId
              ? { ...conversation, unreadByAgent: (conversation.unreadByAgent || 0) + 1 }
              : conversation
          )
        )
      }
    }

    const handleReactionUpdated = updatedMessage => {
      if (selectedSessionRef.current !== updatedMessage?.sessionId) {
        return
      }

      setMessages(prevMessages => mergeChatReactionUpdate(prevMessages, updatedMessage))
    }

    const handleConversationUpdated = conversation => {
      setConversations(prevConversations => {
        const currentTab = activeTabRef.current
        const currentAgentId = agentIdRef.current
        const currentSearch = debouncedSearchQueryRef.current
        const nextConversations = prevConversations.map(item =>
          item.sessionId === conversation.sessionId ? { ...item, ...conversation } : item
        )

        return nextConversations
          .filter(item =>
            conversationMatchesTab(item, currentTab, currentAgentId) &&
            conversationMatchesSearch(item, currentSearch)
          )
          .sort(sortConversationsByLatest)
      })

      setSelectedConversation(prevConversation =>
        prevConversation?.sessionId === conversation.sessionId ? { ...prevConversation, ...conversation } : prevConversation
      )

      loadCountsRef.current?.()
    }

    const handleCustomerTyping = ({ sessionId, isTyping }) => {
      if (selectedSessionRef.current !== sessionId) {
        return
      }

      setCustomerTyping(isTyping)
      clearTimeout(typingTimerRef.current)

      if (isTyping) {
        typingTimerRef.current = setTimeout(() => setCustomerTyping(false), 3500)
      }
    }

    socket.on('chat:new_conversation', handleNewConversation)
    socket.on('chat:new_message', handleNewMessage)
    socket.on('chat:message', handleMessage)
    socket.on('chat:reaction_updated', handleReactionUpdated)
    socket.on('chat:conversation_updated', handleConversationUpdated)
    socket.on('chat:customer_typing', handleCustomerTyping)

    return () => {
      socket.off('chat:new_conversation', handleNewConversation)
      socket.off('chat:new_message', handleNewMessage)
      socket.off('chat:message', handleMessage)
      socket.off('chat:reaction_updated', handleReactionUpdated)
      socket.off('chat:conversation_updated', handleConversationUpdated)
      socket.off('chat:customer_typing', handleCustomerTyping)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, t])

  useEffect(() => {
    if (!selectedSession) {
      previousSessionRef.current = null
      return
    }

    const viewport = messagesViewportRef.current
    if (!viewport) {
      return
    }

    const shouldAnimate = previousSessionRef.current === selectedSession

    requestAnimationFrame(() => {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: shouldAnimate ? 'smooth' : 'auto'
      })
    })

    previousSessionRef.current = selectedSession
  }, [customerTyping, messages, selectedSession])

  const clearPendingImage = useCallback(({ revoke = true } = {}) => {
    setPendingImage(prevImage => {
      if (revoke) {
        revokePreviewUrl(prevImage?.previewUrl)
      }

      return null
    })

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }, [])

  const focusInputWithoutScroll = useCallback(() => {
    const currentInput = inputRef.current
    if (!currentInput) {
      return
    }

    try {
      currentInput.focus({ preventScroll: true })
    } catch {
      currentInput.focus()
    }
  }, [])

  const appendOptimisticAgentMessage = useCallback((payload) => {
    const clientTempId = payload.clientTempId || createClientTempId()
    const tempId = `temp_${clientTempId}`

    setMessages(prevMessages => [
      ...prevMessages,
      {
        _id: tempId,
        clientTempId,
        sessionId: selectedSession,
        sender: 'agent',
        agentId,
        agentName,
        agentAvatar,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
        ...payload
      }
    ])

    return clientTempId
  }, [agentAvatar, agentId, agentName, selectedSession])

  const removeOptimisticAgentMessage = useCallback((clientTempId) => {
    if (!clientTempId) {
      return
    }

    setMessages(prevMessages =>
      prevMessages.filter(message => {
        const shouldRemove = message.isOptimistic && message.clientTempId === clientTempId
        if (shouldRemove) {
          revokeChatImageUrls(message)
        }

        return !shouldRemove
      })
    )
  }, [])

  const emitAgentReply = useCallback((payload) => {
    const socket = getSocket()

    socket.emit('chat:agent_reply', {
      sessionId: selectedSession,
      agentId,
      agentName,
      agentAvatar,
      ...payload
    })
  }, [agentAvatar, agentId, agentName, selectedSession])

  const handleReactToMessage = useCallback((targetMessage, emoji) => {
    if (!targetMessage?._id || targetMessage.isOptimistic || !selectedSession || !agentId) {
      return
    }

    let previousTargetMessage = null
    setMessages(prevMessages => {
      previousTargetMessage = prevMessages.find(message =>
        message?._id?.toString() === targetMessage._id?.toString()
      )
      return applyLocalChatReaction(prevMessages, targetMessage, emoji, reactionActor, agentName)
    })

    getSocket().emit('chat:reaction', {
      sessionId: targetMessage.sessionId || selectedSession,
      messageId: targetMessage._id,
      emoji,
      reactorType: reactionActor.reactorType,
      reactorId: reactionActor.reactorId,
      reactorName: agentName
    }, response => {
      if (response?.success === false) {
        if (previousTargetMessage) {
          setMessages(prevMessages => mergeChatReactionUpdate(prevMessages, previousTargetMessage))
        }
        antdMessage.error(response.message || t('errors.reactionFailed'))
        return
      }

      if (response?.message) {
        setMessages(prevMessages => mergeChatReactionUpdate(prevMessages, response.message))
      }
    })
  }, [agentId, agentName, reactionActor, selectedSession, t])

  const selectConversation = useCallback(async (conversation) => {
    const nextSessionId = conversation?.sessionId

    if (!nextSessionId) {
      return
    }

    if (selectedSessionRef.current === nextSessionId) {
      return
    }

    stopAgentTyping(selectedSessionRef.current)
    selectedSessionRef.current = nextSessionId
    restoredSessionRef.current = nextSessionId
    clearPendingImage()
    setSelectedSession(nextSessionId)
    setSelectedConversation(conversation)
    setMessages([])
    setCustomerTyping(false)
    updateChatSearchParams({ tab: activeTabRef.current, session: nextSessionId })
    await loadHistory(nextSessionId)

    const socket = getSocket()
    socket.emit('chat:join', { sessionId: nextSessionId })

    await apiFetch(`chat/read/${nextSessionId}`, {
      method: 'PATCH',
      body: JSON.stringify({ reader: 'agent' }),
      headers: { 'Content-Type': 'application/json' }
    })

    setConversations(prevConversations =>
      prevConversations.map(item =>
        item.sessionId === conversation.sessionId ? { ...item, unreadByAgent: 0 } : item
      )
    )
  }, [clearPendingImage, loadHistory, stopAgentTyping, updateChatSearchParams])

  const handleAssign = useCallback(async () => {
    if (!selectedSession) {
      return
    }

    if (!agentId) {
      antdMessage.error(t('errors.missingAgent'))
      return
    }

    setAssigning(true)

    try {
      const response = await apiFetch(`chat/assign/${selectedSession}`, {
        method: 'PATCH',
        body: JSON.stringify({ agentId, agentName, agentAvatar }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response?.success) {
        throw new Error(response?.message || t('errors.assignFailed'))
      }

      const nextConversation = response.data || {
        status: 'open',
        assignedAgent: {
          agentId,
          agentName,
          agentAvatar,
          assignedAt: new Date()
        }
      }

      setSelectedConversation(prevConversation =>
        prevConversation ? { ...prevConversation, ...nextConversation, status: 'open' } : prevConversation
      )
      setConversations(prevConversations =>
        prevConversations.map(conversation =>
          conversation.sessionId === selectedSession
            ? { ...conversation, ...nextConversation, status: 'open' }
            : conversation
        )
      )
      setActiveTab('mine')
      updateChatSearchParams({ tab: 'mine', session: selectedSession })
      await loadHistory(selectedSession)
      loadCounts()
    } catch (error) {
      antdMessage.error(error?.message || t('errors.assignFailed'))
    } finally {
      setAssigning(false)
    }
  }, [agentAvatar, agentId, agentName, loadCounts, loadHistory, selectedSession, t, updateChatSearchParams])

  const handleResolve = useCallback(async () => {
    if (!selectedSession) {
      return
    }

    setResolving(true)

    try {
      const response = await apiFetch(`chat/resolve/${selectedSession}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response?.success) {
        throw new Error(response?.message || t('errors.resolveFailed'))
      }

      const nextConversation = response.data || { status: 'resolved' }

      setSelectedConversation(prevConversation =>
        prevConversation ? { ...prevConversation, ...nextConversation, status: 'resolved' } : prevConversation
      )
      setConversations(prevConversations =>
        prevConversations.map(conversation =>
          conversation.sessionId === selectedSession
            ? { ...conversation, ...nextConversation, status: 'resolved' }
            : conversation
        )
      )
      setActiveTab('resolved')
      updateChatSearchParams({ tab: 'resolved', session: selectedSession })
      await loadHistory(selectedSession)
      loadCounts()
    } catch (error) {
      antdMessage.error(error?.message || t('errors.resolveFailed'))
    } finally {
      setResolving(false)
    }
  }, [loadCounts, loadHistory, selectedSession, t, updateChatSearchParams])

  const isAssignedToMe = selectedConversation?.assignedAgent?.agentId === agentId
  const isResolved = selectedConversation?.status === 'resolved'
  const canReplyToConversation = !!selectedConversation && (selectedConversation.status !== 'unassigned' || isAssignedToMe)
  const canSend = (!!input.trim() || !!pendingImage) && canReplyToConversation && !isResolved

  const scheduleAgentTyping = useCallback((value) => {
    const sessionId = selectedSessionRef.current

    if (!sessionId || isNote || isResolved || !canReplyToConversation || !String(value || '').trim()) {
      stopAgentTyping(sessionId)
      return
    }

    emitAgentTyping(true, sessionId)
    clearTimeout(agentTypingTimerRef.current)
    agentTypingTimerRef.current = window.setTimeout(() => {
      emitAgentTyping(false, sessionId)
    }, 2000)
  }, [canReplyToConversation, emitAgentTyping, isNote, isResolved, stopAgentTyping])

  useEffect(() => {
    if (isNote || isResolved || !canReplyToConversation) {
      stopAgentTyping()
    }
  }, [canReplyToConversation, isNote, isResolved, stopAgentTyping])

  const sendReply = useCallback(async () => {
    const text = input.trim()
    if ((!text && !pendingImage) || !selectedSession || isUploadingImage || !canReplyToConversation || isResolved) {
      return
    }

    stopAgentTyping(selectedSession)

    try {
      if (pendingImage) {
        const clientTempId = createClientTempId()

        appendOptimisticAgentMessage({
          clientTempId,
          type: 'image',
          imageUrl: pendingImage.previewUrl,
          message: text,
          isInternal: false
        })

        clearPendingImage({ revoke: false })
        setInput('')

        if (inputRef.current) {
          inputRef.current.style.height = 'auto'
        }

        focusInputWithoutScroll()
        setIsUploadingImage(true)

        try {
          const imageUrl = await chatService.uploadImage(pendingImage.file)

          emitAgentReply({
            clientTempId,
            type: 'image',
            imageUrl,
            message: text,
            isInternal: false
          })
        } catch (error) {
          removeOptimisticAgentMessage(clientTempId)
          throw error
        }
      } else {
        const clientTempId = appendOptimisticAgentMessage({
          clientTempId: createClientTempId(),
          message: text,
          type: isNote ? 'note' : 'text',
          isInternal: isNote
        })

        emitAgentReply({
          clientTempId,
          message: text,
          type: 'text',
          isInternal: isNote
        })

        setInput('')

        if (inputRef.current) {
          inputRef.current.style.height = 'auto'
        }

        focusInputWithoutScroll()
      }
    } catch (error) {
      antdMessage.error(error.message || t('errors.uploadImageFailed'))
    } finally {
      setIsUploadingImage(false)
    }
  }, [
    appendOptimisticAgentMessage,
    canReplyToConversation,
    clearPendingImage,
    emitAgentReply,
    focusInputWithoutScroll,
    input,
    isNote,
    isResolved,
    isUploadingImage,
    pendingImage,
    removeOptimisticAgentMessage,
    selectedSession,
    stopAgentTyping,
    t
  ])

  const handleImageChange = useCallback((event) => {
    const [file] = Array.from(event.target.files || [])
    if (!file || isNote) {
      return
    }

    setPendingImage(prevImage => {
      revokePreviewUrl(prevImage?.previewUrl)
      return {
        file,
        name: file.name,
        previewUrl: URL.createObjectURL(file)
      }
    })

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }, [isNote])

  const openImagePicker = useCallback(() => {
    if (!isNote && !isUploadingImage && canReplyToConversation) {
      imageInputRef.current?.click()
    }
  }, [canReplyToConversation, isNote, isUploadingImage])

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendReply()
    }
  }, [sendReply])

  const handleComposerChange = useCallback((event) => {
    const nextValue = event.target.value

    setInput(nextValue)
    event.target.style.height = 'auto'
    event.target.style.height = `${Math.min(event.target.scrollHeight, 100)}px`
    scheduleAgentTyping(nextValue)
  }, [scheduleAgentTyping])

  const handleInsertQuickReply = useCallback((quickReply) => {
    const resolvedContent = resolveQuickReplyVariables(quickReply?.content, {
      customerName: selectedConversation?.customer?.name || '',
      agentName,
      storeName: websiteConfig?.siteName || 'SmartMall',
      orderCode: selectedConversation?.orderCode || '',
      productName: selectedConversation?.productName || ''
    }).trim()

    if (!resolvedContent) {
      return
    }

    setInput(currentInput => {
      const trimmedInput = currentInput.trimEnd()
      return trimmedInput ? `${trimmedInput}\n${resolvedContent}` : resolvedContent
    })

    window.requestAnimationFrame(() => {
      const currentInput = inputRef.current

      if (currentInput) {
        currentInput.style.height = 'auto'
        currentInput.style.height = `${Math.min(currentInput.scrollHeight, 100)}px`
      }

      focusInputWithoutScroll()
    })

    if (quickReply?._id) {
      void recordQuickReplyUsage(quickReply._id).catch(() => {})
    }
  }, [
    agentName,
    focusInputWithoutScroll,
    selectedConversation?.customer?.name,
    selectedConversation?.orderCode,
    selectedConversation?.productName,
    websiteConfig?.siteName
  ])

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value)
  }, [])

  const handleBackToList = useCallback(() => {
    stopAgentTyping(selectedSessionRef.current)
    selectedSessionRef.current = null
    setSelectedSession(null)
    setSelectedConversation(null)
    setMessages([])
    setCustomerTyping(false)
    updateChatSearchParams({ tab: activeTabRef.current, session: null })
  }, [stopAgentTyping, updateChatSearchParams])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)

    try {
      await Promise.all([loadConversations({ page: 1 }), loadCounts()])
    } finally {
      setRefreshing(false)
    }
  }, [loadConversations, loadCounts])

  const loadMoreConversations = useCallback(() => {
    if (
      conversationsLoading ||
      conversationsLoadingMore ||
      !conversationPagination.hasMore
    ) {
      return
    }

    void loadConversations({
      append: true,
      page: conversationPagination.page + 1,
      silent: true
    })
  }, [
    conversationPagination.hasMore,
    conversationPagination.page,
    conversationsLoading,
    conversationsLoadingMore,
    loadConversations
  ])

  const handleTabChange = useCallback(tabKey => {
    const nextTab = getValidChatTab(tabKey)

    stopAgentTyping(selectedSessionRef.current)
    setActiveTab(nextTab)
    selectedSessionRef.current = null
    setSelectedSession(null)
    setSelectedConversation(null)
    setMessages([])
    setCustomerTyping(false)
    restoredSessionRef.current = null
    updateChatSearchParams({ tab: nextTab, session: null })
  }, [stopAgentTyping, updateChatSearchParams])

  const filteredConversations = conversations

  const switchToReplyMode = useCallback(() => {
    setIsNote(false)
  }, [])

  const switchToNoteMode = useCallback(() => {
    clearPendingImage()
    setIsNote(true)
  }, [clearPendingImage])

  return {
    activeTab,
    assigning,
    canReplyToConversation,
    canSend,
    conversationsHasMore: conversationPagination.hasMore,
    conversationsLoading,
    conversationsLoadingMore,
    conversationsTotal: conversationPagination.total,
    counts,
    customerTyping,
    filteredConversations,
    input,
    inputRef,
    imageInputRef,
    isAssignedToMe,
    isNote,
    isResolved,
    isUploadingImage,
    messages,
    messagesLoading,
    messagesViewportRef,
    pendingImage,
    quickReplies,
    quickRepliesLoading,
    reactionActor,
    resolving,
    refreshing,
    searchQuery,
    selectedConversation,
    selectedSession,
    handleAssign,
    handleBackToList,
    handleComposerChange,
    handleImageChange,
    handleInsertQuickReply,
    handleKeyDown,
    handleLoadMoreConversations: loadMoreConversations,
    handleRefresh,
    handleReactToMessage,
    handleResolve,
    handleSearchChange,
    handleSelectConversation: selectConversation,
    handleTabChange,
    openImagePicker,
    sendReply,
    switchToNoteMode,
    switchToReplyMode,
    clearPendingImage
  }
}
