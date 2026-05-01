import { useEffect } from 'react'

import { getSocket } from '@/services/realtime/socket'
import {
  getLocalizedSystemMessage,
  isSameOptimisticImageMessage,
  mergeChatReactionUpdate,
  revokeChatImageUrls
} from '@/utils/chatMessage'

import { getMessagePreview } from '../utils'
import {
  conversationMatchesSearch,
  conversationMatchesTab,
  sortConversationsByLatest
} from './chatConversationUtils'

export function useChatSocketEvents({
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
}) {
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

    const buildLastMessagePreview = message => getMessagePreview(message, {
      emptyText: t('message.empty'),
      imageText: t('message.image'),
      language,
      systemText: msg => getLocalizedSystemMessage(msg, t, language)
    })

    const handleNewMessage = message => {
      refreshConversationListIfMissing(message.sessionId)

      setConversations(prevConversations =>
        prevConversations
          .map(conversation =>
            conversation.sessionId === message.sessionId
              ? {
                  ...conversation,
                  lastMessage: buildLastMessagePreview(message),
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
                    lastMessage: buildLastMessagePreview(message),
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
  }, [
    activeTabRef,
    agentIdRef,
    conversationsRef,
    debouncedSearchQueryRef,
    language,
    loadConversationsRef,
    loadCountsRef,
    selectedSessionRef,
    setConversationPagination,
    setConversations,
    setCustomerTyping,
    setMessages,
    setSelectedConversation,
    t,
    typingTimerRef
  ])
}
