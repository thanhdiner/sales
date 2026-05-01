import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { message as antdMessage } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import { getSocket } from '@/services/realtime/socket'
import {
  applyLocalChatReaction,
  mergeChatReactionUpdate
} from '@/utils/chatMessage'

import { apiFetch } from '../utils'
import {
  getConversationTab,
  getValidChatTab
} from './chatConversationUtils'
import { useChatActions } from './useChatActions'
import { useChatComposer } from './useChatComposer'
import { useChatConversations } from './useChatConversations'
import { useChatHistory } from './useChatHistory'
import { useChatSocketEvents } from './useChatSocketEvents'
import { useQuickReplies } from './useQuickReplies'

export function useChat() {
  const { t, i18n } = useTranslation('adminChat')
  const language = i18n.resolvedLanguage || i18n.language
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = getValidChatTab(searchParams.get('tab'))
  const initialSession = searchParams.get('session') || null

  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedSession, setSelectedSession] = useState(initialSession)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [customerTyping, setCustomerTyping] = useState(false)

  const messagesViewportRef = useRef(null)
  const inputRef = useRef(null)
  const imageInputRef = useRef(null)
  const typingTimerRef = useRef(null)
  const agentTypingTimerRef = useRef(null)
  const previousSessionRef = useRef(null)
  const selectedSessionRef = useRef(null)
  const activeTabRef = useRef(initialTab)
  const agentIdRef = useRef(null)
  const restoredSessionRef = useRef(null)
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

  const {
    messages,
    setMessages,
    messagesLoading,
    loadHistory
  } = useChatHistory()

  const {
    conversations,
    setConversations,
    counts,
    searchQuery,
    debouncedSearchQuery,
    conversationsLoading,
    conversationsLoadingMore,
    conversationPagination,
    setConversationPagination,
    refreshing,
    loadConversations,
    loadCounts,
    handleSearchChange,
    handleRefresh,
    loadMoreConversations
  } = useChatConversations({ activeTab, agentId })

  const isAssignedToMe = selectedConversation?.assignedAgent?.agentId === agentId
  const isResolved = selectedConversation?.status === 'resolved'
  const canReplyToConversation = !!selectedConversation && (selectedConversation.status !== 'unassigned' || isAssignedToMe)

  const {
    input,
    setInput,
    isNote,
    isUploadingImage,
    pendingImage,
    canSend,
    stopAgentTyping,
    focusInputWithoutScroll,
    clearPendingImage,
    handleComposerChange,
    handleImageChange,
    handleKeyDown,
    openImagePicker,
    sendReply,
    switchToNoteMode,
    switchToReplyMode
  } = useChatComposer({
    selectedSession,
    selectedSessionRef,
    agentTypingTimerRef,
    agentId,
    agentName,
    agentAvatar,
    canReplyToConversation,
    isResolved,
    inputRef,
    imageInputRef,
    setMessages,
    t
  })

  const {
    quickReplies,
    quickRepliesLoading,
    handleInsertQuickReply
  } = useQuickReplies({
    language,
    selectedConversation,
    agentName,
    websiteConfig,
    inputRef,
    focusInputWithoutScroll,
    setInput
  })

  const {
    assigning,
    resolving,
    handleAssign,
    handleResolve
  } = useChatActions({
    selectedSession,
    agentId,
    agentName,
    agentAvatar,
    loadHistory,
    loadCounts,
    setActiveTab,
    setSelectedConversation,
    setConversations,
    updateChatSearchParams,
    t
  })

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
    conversationsRef.current = conversations
  }, [conversations])

  useEffect(() => {
    debouncedSearchQueryRef.current = debouncedSearchQuery
  }, [debouncedSearchQuery])

  useEffect(() => {
    loadConversationsRef.current = loadConversations
  }, [loadConversations])

  useEffect(() => {
    loadCountsRef.current = loadCounts
  }, [loadCounts])

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
  }, [restoreConversationFromUrl, searchParams, setMessages, stopAgentTyping])

  useChatSocketEvents({
    language,
    t,
    selectedSessionRef,
    activeTabRef,
    agentIdRef,
    conversationsRef,
    debouncedSearchQueryRef,
    loadConversationsRef,
    loadCountsRef,
    typingTimerRef,
    setMessages,
    setConversations,
    setConversationPagination,
    setSelectedConversation,
    setCustomerTyping
  })

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
  }, [agentId, agentName, reactionActor, selectedSession, setMessages, t])

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
  }, [clearPendingImage, loadHistory, setConversations, setMessages, stopAgentTyping, updateChatSearchParams])

  const handleBackToList = useCallback(() => {
    stopAgentTyping(selectedSessionRef.current)
    selectedSessionRef.current = null
    setSelectedSession(null)
    setSelectedConversation(null)
    setMessages([])
    setCustomerTyping(false)
    updateChatSearchParams({ tab: activeTabRef.current, session: null })
  }, [setMessages, stopAgentTyping, updateChatSearchParams])

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
  }, [setMessages, stopAgentTyping, updateChatSearchParams])

  const filteredConversations = conversations

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
