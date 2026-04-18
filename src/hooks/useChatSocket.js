import { useEffect, useRef } from 'react'
import { getSocket } from '@/services/socketService'

export function useChatSocket({
  sessionId,
  open,
  setMessages,
  setUnread,
  setIsBotTyping,
  setConversation,
  setIsTypingAgent,
  setIsResolved
}) {
  const typingTimer = useRef(null)

  useEffect(() => {
    const socket = getSocket()
    if (!socket.connected) socket.connect()

    const joinRoom = () => socket.emit('chat:join', { sessionId })
    joinRoom()
    socket.on('connect', joinRoom)

    const onMessage = (msg) => {
      setMessages(prev => {
        if (prev.some(m => m._id?.toString() === msg._id?.toString())) return prev
        if (msg.sender === 'customer' || msg.sender === 'guest') {
          const optimisticIndex = prev.findIndex(m => m.isOptimistic && m.message === msg.message)
          if (optimisticIndex !== -1) {
            const newMsgs = [...prev]
            newMsgs[optimisticIndex] = msg
            return newMsgs
          }
        }
        if (msg.sender === 'bot') {
          msg.isNew = true
        }
        return [...prev, msg]
      })
      if ((msg.sender === 'agent' || msg.sender === 'bot') && !open) setUnread(u => u + 1)
      if (msg.sender === 'bot') setIsBotTyping(false)
      if (msg.type === 'system') setConversation(prev => prev ? { ...prev } : prev)
    }

    const onTyping = ({ isTyping }) => {
      setIsTypingAgent(isTyping)
      clearTimeout(typingTimer.current)
      if (isTyping) typingTimer.current = setTimeout(() => setIsTypingAgent(false), 3500)
    }

    const onBotTyping = ({ isTyping }) => {
      setIsBotTyping(isTyping)
    }

    const onResolved = () => setIsResolved(true)

    const onConvUpdated = (conv) => {
      if (conv.sessionId === sessionId) setConversation(conv)
    }

    socket.on('chat:message', onMessage)
    socket.on('chat:typing', onTyping)
    socket.on('chat:bot_typing', onBotTyping)
    socket.on('chat:resolved', onResolved)
    socket.on('chat:conversation_updated', onConvUpdated)

    return () => {
      socket.off('connect', joinRoom)
      socket.off('chat:message', onMessage)
      socket.off('chat:typing', onTyping)
      socket.off('chat:bot_typing', onBotTyping)
      socket.off('chat:resolved', onResolved)
      socket.off('chat:conversation_updated', onConvUpdated)
    }
  }, [sessionId, open, setMessages, setUnread, setIsBotTyping, setConversation, setIsTypingAgent, setIsResolved])

  const requestHumanAgent = () => {
    getSocket().emit('chat:request_agent', { sessionId, reason: 'Khách yêu cầu chuyển nhân viên' })
  }

  const switchToBot = () => {
    getSocket().emit('chat:switch_to_bot', { sessionId })
  }

  return { requestHumanAgent, switchToBot }
}

