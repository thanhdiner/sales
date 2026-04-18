import { useState, useRef } from 'react'
import { getSocket } from '@/services/socketService'

export function useChatInput({ sessionId, clientUser, setMessages }) {
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const typingSocketTimer = useRef(null)

  const senderName = clientUser?.fullName || clientUser?.name || 'Khách'
  const senderAvatar = clientUser?.avatar || null
  const senderId = clientUser?._id || null

  const sendMessage = (text, currentPage = window.location.pathname) => {
    const t = (text || input).trim()
    if (!t) return

    // Optimistic UI
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    setMessages(prev => [...prev, {
      _id: tempId, 
      message: t, 
      sender: clientUser ? 'customer' : 'guest', 
      createdAt: new Date().toISOString(), 
      isOptimistic: true
    }])

    const socket = getSocket()
    socket.emit('chat:join', { sessionId })
    socket.emit('chat:send', { 
      sessionId, 
      message: t, 
      senderName, 
      senderAvatar, 
      senderId, 
      currentPage 
    })
    
    setInput('')
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.focus()
    }
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'

    const socket = getSocket()
    socket.emit('chat:typing', { sessionId, isTyping: true, role: 'customer' })
    clearTimeout(typingSocketTimer.current)
    typingSocketTimer.current = setTimeout(() => {
      socket.emit('chat:typing', { sessionId, isTyping: false, role: 'customer' })
    }, 2000)
  }

  return { input, setInput, inputRef, sendMessage, handleInputChange }
}
