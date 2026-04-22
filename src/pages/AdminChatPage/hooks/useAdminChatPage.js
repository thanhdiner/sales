import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { message as antdMessage } from 'antd'
import { useSelector } from 'react-redux'

import { getSocket } from '@/services/socketService'
import { chatService } from '@/services/chatService'
import { createClientTempId, isSameOptimisticImageMessage, revokeChatImageUrls } from '@/utils/chatMessage'

import { apiFetch, getMessagePreview, revokePreviewUrl } from '../utils'

export function useAdminChatPage() {
  const [activeTab, setActiveTab] = useState('unassigned')
  const [conversations, setConversations] = useState([])
  const [counts, setCounts] = useState({})
  const [selectedSession, setSelectedSession] = useState(null)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isNote, setIsNote] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [customerTyping, setCustomerTyping] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [pendingImage, setPendingImage] = useState(null)

  const messagesViewportRef = useRef(null)
  const inputRef = useRef(null)
  const imageInputRef = useRef(null)
  const typingTimerRef = useRef(null)
  const pendingImageRef = useRef(null)
  const previousSessionRef = useRef(null)
  const selectedSessionRef = useRef(null)
  const activeTabRef = useRef('unassigned')
  const agentIdRef = useRef(null)

  const admin = useSelector(state => state.user?.user)
  const agentId = admin?._id || null
  const agentName = admin?.fullName || admin?.name || 'Agent'
  const agentAvatar = admin?.avatar || null

  useEffect(() => {
    selectedSessionRef.current = selectedSession
  }, [selectedSession])

  useEffect(() => {
    activeTabRef.current = activeTab
  }, [activeTab])

  useEffect(() => {
    agentIdRef.current = agentId
  }, [agentId])

  useEffect(() => {
    pendingImageRef.current = pendingImage
  }, [pendingImage])

  useEffect(() => () => {
    revokePreviewUrl(pendingImageRef.current?.previewUrl)
  }, [])

  const loadConversations = useCallback(async () => {
    try {
      let statusFilter = activeTab
      if (activeTab === 'mine') {
        statusFilter = 'open'
      }

      const response = await apiFetch(
        `chat/conversations?status=${
          statusFilter === 'unassigned' || statusFilter === 'resolved' ? statusFilter : 'open'
        }`
      )

      let nextConversations = response.data || []

      if (activeTab === 'mine') {
        nextConversations = nextConversations.filter(conversation => conversation.assignedAgent?.agentId === agentId)
      }

      setConversations(nextConversations)
    } catch {
      // ignore
    }
  }, [activeTab, agentId])

  const loadCounts = useCallback(async () => {
    try {
      const [unassignedResponse, openResponse, resolvedResponse] = await Promise.all([
        apiFetch('chat/conversations?status=unassigned&limit=1000'),
        apiFetch('chat/conversations?status=open&limit=1000'),
        apiFetch('chat/conversations?status=resolved&limit=1000')
      ])

      const openConversations = openResponse.data || []
      const mineCount = openConversations.filter(conversation => conversation.assignedAgent?.agentId === agentId).length

      setCounts({
        unassigned: (unassignedResponse.data || []).length,
        mine: mineCount,
        open: openConversations.length,
        resolved: (resolvedResponse.data || []).length
      })
    } catch {
      // ignore
    }
  }, [agentId])

  const loadHistory = useCallback(async (sessionId) => {
    try {
      const response = await apiFetch(`chat/history/${sessionId}?internal=true`)
      setMessages(response.data || [])
    } catch {
      // ignore
    }
  }, [])

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

    const handleNewConversation = (conversation) => {
      if (activeTabRef.current === 'unassigned') {
        setConversations(prevConversations => {
          if (prevConversations.find(item => item.sessionId === conversation.sessionId)) {
            return prevConversations
          }

          return [conversation, ...prevConversations]
        })
      }

      loadCounts()
    }

    const updateMessagesWithSocketPayload = (message) => {
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

    const handleNewMessage = (message) => {
      setConversations(prevConversations =>
        prevConversations
          .map(conversation =>
            conversation.sessionId === message.sessionId
              ? {
                  ...conversation,
                  lastMessage: getMessagePreview(message),
                  lastMessageAt: message.createdAt,
                  lastMessageSender: message.sender,
                  unreadByAgent:
                    selectedSessionRef.current === message.sessionId
                      ? 0
                      : (conversation.unreadByAgent || 0) + (message.sender === 'customer' ? 1 : 0)
                }
              : conversation
          )
          .sort((left, right) => new Date(right.lastMessageAt || right.createdAt) - new Date(left.lastMessageAt || left.createdAt))
      )

      updateMessagesWithSocketPayload(message)
    }

    const handleMessage = (message) => {
      updateMessagesWithSocketPayload(message)

      if (message.sender !== 'customer') {
        setConversations(prevConversations =>
          prevConversations
            .map(conversation =>
              conversation.sessionId === message.sessionId
                ? {
                    ...conversation,
                    lastMessage: getMessagePreview(message),
                    lastMessageAt: message.createdAt,
                    lastMessageSender: message.sender
                  }
                : conversation
            )
            .sort((left, right) => new Date(right.lastMessageAt || right.createdAt) - new Date(left.lastMessageAt || left.createdAt))
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

    const handleConversationUpdated = (conversation) => {
      setConversations(prevConversations => {
        const currentTab = activeTabRef.current
        const currentAgentId = agentIdRef.current
        const nextConversations = prevConversations.map(item =>
          item.sessionId === conversation.sessionId ? { ...item, ...conversation } : item
        )

        return nextConversations.filter(item => {
          if (currentTab === 'unassigned') return item.status === 'unassigned'
          if (currentTab === 'mine') return item.status === 'open' && item.assignedAgent?.agentId === currentAgentId
          if (currentTab === 'open') return item.status === 'open'
          if (currentTab === 'resolved') return item.status === 'resolved'
          return true
        })
      })

      setSelectedConversation(prevConversation =>
        prevConversation?.sessionId === conversation.sessionId ? { ...prevConversation, ...conversation } : prevConversation
      )

      loadCounts()
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
    socket.on('chat:conversation_updated', handleConversationUpdated)
    socket.on('chat:customer_typing', handleCustomerTyping)

    return () => {
      socket.off('chat:new_conversation', handleNewConversation)
      socket.off('chat:new_message', handleNewMessage)
      socket.off('chat:message', handleMessage)
      socket.off('chat:conversation_updated', handleConversationUpdated)
      socket.off('chat:customer_typing', handleCustomerTyping)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const selectConversation = useCallback(async (conversation) => {
    clearPendingImage()
    setSelectedSession(conversation.sessionId)
    setSelectedConversation(conversation)
    setMessages([])
    setCustomerTyping(false)
    await loadHistory(conversation.sessionId)

    const socket = getSocket()
    socket.emit('chat:join', { sessionId: conversation.sessionId })

    await apiFetch(`chat/read/${conversation.sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify({ reader: 'agent' }),
      headers: { 'Content-Type': 'application/json' }
    })

    setConversations(prevConversations =>
      prevConversations.map(item =>
        item.sessionId === conversation.sessionId ? { ...item, unreadByAgent: 0 } : item
      )
    )
  }, [clearPendingImage, loadHistory])

  const handleAssign = useCallback(() => {
    if (!selectedSession) {
      return
    }

    const socket = getSocket()
    socket.emit('chat:assign', { sessionId: selectedSession, agentId, agentName, agentAvatar })

    setSelectedConversation(prevConversation =>
      prevConversation
        ? {
            ...prevConversation,
            status: 'open',
            assignedAgent: {
              agentId,
              agentName,
              agentAvatar,
              assignedAt: new Date()
            }
          }
        : prevConversation
    )
  }, [agentAvatar, agentId, agentName, selectedSession])

  const handleResolve = useCallback(() => {
    if (!selectedSession) {
      return
    }

    const socket = getSocket()
    socket.emit('chat:resolve', { sessionId: selectedSession, agentName })
    setSelectedConversation(prevConversation =>
      prevConversation ? { ...prevConversation, status: 'resolved' } : prevConversation
    )
  }, [agentName, selectedSession])

  const sendReply = useCallback(async () => {
    const text = input.trim()
    if ((!text && !pendingImage) || !selectedSession || isUploadingImage) {
      return
    }

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
      antdMessage.error(error.message || 'Không thể tải ảnh lên')
    } finally {
      setIsUploadingImage(false)
    }
  }, [
    appendOptimisticAgentMessage,
    clearPendingImage,
    emitAgentReply,
    focusInputWithoutScroll,
    input,
    isNote,
    isUploadingImage,
    pendingImage,
    removeOptimisticAgentMessage,
    selectedSession
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
    if (!isNote && !isUploadingImage) {
      imageInputRef.current?.click()
    }
  }, [isNote, isUploadingImage])

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendReply()
    }
  }, [sendReply])

  const handleComposerChange = useCallback((event) => {
    setInput(event.target.value)
    event.target.style.height = 'auto'
    event.target.style.height = `${Math.min(event.target.scrollHeight, 100)}px`
  }, [])

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value)
  }, [])

  const handleBackToList = useCallback(() => {
    setSelectedSession(null)
  }, [])

  const handleRefresh = useCallback(() => {
    loadConversations()
    loadCounts()
  }, [loadConversations, loadCounts])

  const filteredConversations = useMemo(
    () =>
      conversations.filter(conversation =>
        conversation.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversation.sessionId?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [conversations, searchQuery]
  )

  const isAssignedToMe = selectedConversation?.assignedAgent?.agentId === agentId
  const isResolved = selectedConversation?.status === 'resolved'
  const canSend = !!input.trim() || !!pendingImage

  const switchToReplyMode = useCallback(() => {
    setIsNote(false)
  }, [])

  const switchToNoteMode = useCallback(() => {
    clearPendingImage()
    setIsNote(true)
  }, [clearPendingImage])

  return {
    activeTab,
    canSend,
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
    messagesViewportRef,
    pendingImage,
    searchQuery,
    selectedConversation,
    selectedSession,
    handleAssign,
    handleBackToList,
    handleComposerChange,
    handleImageChange,
    handleKeyDown,
    handleRefresh,
    handleResolve,
    handleSearchChange,
    handleSelectConversation: selectConversation,
    handleTabChange: setActiveTab,
    openImagePicker,
    sendReply,
    switchToNoteMode,
    switchToReplyMode,
    clearPendingImage
  }
}
