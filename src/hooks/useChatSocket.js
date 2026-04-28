import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { syncClientStateFromBotTools } from '@/lib/clientCache'
import { getSocket } from '@/services/socketService'
import { clearResolvedSessionMarker, markSessionResolved } from '@/hooks/useChatSession'
import {
  hasChatImages,
  isSameImagePayload,
  isSameOptimisticImageMessage,
  mergeChatReactionUpdate,
  revokeChatImageUrls
} from '@/utils/chatMessage'

export function useChatSocket({
  sessionId,
  open,
  setMessages,
  setUnread,
  setIsBotTyping,
  setBotActivity,
  setConversation,
  setIsTypingAgent,
  setIsResolved
}) {
  const dispatch = useDispatch()
  const typingTimer = useRef(null)
  const botToolSyncQueue = useRef(Promise.resolve())

  useEffect(() => {
    const socket = getSocket()
    if (!socket.connected) socket.connect()

    const joinRoom = () => socket.emit('chat:join', { sessionId })
    joinRoom()
    socket.on('connect', joinRoom)

    const onMessage = (msg) => {
      const isBotMessage = msg.sender === 'bot'
      const toolsUsed = isBotMessage ? msg.metadata?.toolsUsed : []
      const nextMsg = isBotMessage ? { ...msg, isNew: true } : msg

      setMessages(prev => {
        if (prev.some(m => m._id?.toString() === nextMsg._id?.toString())) return prev
        if (nextMsg.sender === 'customer' || nextMsg.sender === 'guest') {
          const optimisticIndex = prev.findIndex(m =>
            m.isOptimistic &&
            (
              (nextMsg.clientTempId && m.clientTempId === nextMsg.clientTempId) ||
              (nextMsg.type === 'image' && m.type === 'image' && isSameImagePayload(m, nextMsg)) ||
              (nextMsg.type === 'image' && m.type === 'image' && isSameOptimisticImageMessage(m, nextMsg)) ||
              (!hasChatImages(nextMsg) && m.message === nextMsg.message)
            )
          )
          if (optimisticIndex !== -1) {
            const newMsgs = [...prev]
            revokeChatImageUrls(newMsgs[optimisticIndex])
            newMsgs[optimisticIndex] = nextMsg
            return newMsgs
          }
        }
        return [...prev, nextMsg]
      })
      if (Array.isArray(toolsUsed) && toolsUsed.length > 0) {
        botToolSyncQueue.current = botToolSyncQueue.current
          .catch(() => undefined)
          .then(() => syncClientStateFromBotTools(dispatch, toolsUsed))
          .catch(() => undefined)
      }
      if ((nextMsg.sender === 'agent' || nextMsg.sender === 'bot') && !open) setUnread(u => u + 1)
      if (nextMsg.sender === 'bot') {
        setIsBotTyping(false)
        setBotActivity?.([])
      }
      if (nextMsg.type === 'system') setConversation(prev => prev ? { ...prev } : prev)
    }

    const onTyping = ({ isTyping }) => {
      setIsTypingAgent(isTyping)
      clearTimeout(typingTimer.current)
      if (isTyping) typingTimer.current = setTimeout(() => setIsTypingAgent(false), 3500)
    }

    const onBotTyping = ({ isTyping }) => {
      setIsBotTyping(isTyping)
      if (isTyping) setBotActivity?.([])
      else setBotActivity?.([])
    }

    const onBotActivity = (activity) => {
      if (activity?.sessionId && activity.sessionId !== sessionId) return

      setBotActivity?.(prev => {
        const nextActivity = {
          ...activity,
          receivedAt: Date.now()
        }
        const key = `${nextActivity.type || 'step'}:${nextActivity.toolName || ''}:${nextActivity.round || ''}`
        const existingIndex = prev.findIndex(item =>
          `${item.type || 'step'}:${item.toolName || ''}:${item.round || ''}` === key
        )

        if (existingIndex === -1) return [...prev, nextActivity]

        const next = [...prev]
        next[existingIndex] = {
          ...next[existingIndex],
          ...nextActivity
        }
        return next
      })
    }

    const onResolved = () => {
      markSessionResolved(sessionId)
      setIsResolved(true)
    }

    const onReactionUpdated = (updatedMessage) => {
      if (updatedMessage?.sessionId !== sessionId) return
      setMessages(prev => mergeChatReactionUpdate(prev, updatedMessage))
    }

    const onConvUpdated = (conv) => {
      if (conv.sessionId !== sessionId) return

      setConversation(conv)
      const resolved = conv.status === 'resolved'
      setIsResolved(resolved)
      if (resolved) markSessionResolved(sessionId)
      else clearResolvedSessionMarker(sessionId)
    }

    socket.on('chat:message', onMessage)
    socket.on('chat:typing', onTyping)
    socket.on('chat:bot_typing', onBotTyping)
    socket.on('chat:bot_activity', onBotActivity)
    socket.on('chat:resolved', onResolved)
    socket.on('chat:conversation_updated', onConvUpdated)
    socket.on('chat:reaction_updated', onReactionUpdated)

    return () => {
      socket.off('connect', joinRoom)
      socket.off('chat:message', onMessage)
      socket.off('chat:typing', onTyping)
      socket.off('chat:bot_typing', onBotTyping)
      socket.off('chat:bot_activity', onBotActivity)
      socket.off('chat:resolved', onResolved)
      socket.off('chat:conversation_updated', onConvUpdated)
      socket.off('chat:reaction_updated', onReactionUpdated)
    }
  }, [dispatch, sessionId, open, setMessages, setUnread, setIsBotTyping, setBotActivity, setConversation, setIsTypingAgent, setIsResolved])

  const requestHumanAgent = () => {
    setConversation(prev => ({
      ...(prev || { sessionId }),
      botStats: {
        ...(prev?.botStats || {}),
        escalated: true
      }
    }))
    getSocket().emit('chat:request_agent', { sessionId, reason: 'Khach yeu cau chuyen nhan vien' })
  }

  const switchToBot = () => {
    setConversation(prev => ({
      ...(prev || { sessionId }),
      status: 'unassigned',
      assignedAgent: null,
      botStats: {
        ...(prev?.botStats || {}),
        escalated: false
      }
    }))
    getSocket().emit('chat:switch_to_bot', { sessionId })
  }

  return { requestHumanAgent, switchToBot }
}
