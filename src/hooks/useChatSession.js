import { useState } from 'react'
import { getSocket } from '@/services/socketService'

export function getSessionId() {
  let sid = localStorage.getItem('chatSessionId')
  if (!sid) {
    sid = 'chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9)
    localStorage.setItem('chatSessionId', sid)
  }
  return sid
}

export function newSessionId() {
  const sid = 'chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9)
  localStorage.setItem('chatSessionId', sid)
  return sid
}

export function useChatSession() {
  const [open, setOpenState] = useState(() => localStorage.getItem('chatOpen') === 'true')
  const [view, setViewState] = useState(() => localStorage.getItem('chatView') || 'home')
  const [sessionId, setSessionId] = useState(getSessionId)

  const setOpen = (val) => {
    setOpenState(val)
    localStorage.setItem('chatOpen', String(val))
  }

  const setView = (val) => {
    setViewState(val)
    localStorage.setItem('chatView', val)
  }

  const startNewConversation = ({ setMessages, setConversation, setIsResolved, setHistoryLoaded }) => {
    const newSid = newSessionId()
    setSessionId(newSid)
    setMessages([])
    setConversation(null)
    setIsResolved(false)
    setHistoryLoaded(false)
    getSocket().emit('chat:join', { sessionId: newSid })
    setView('chat')
  }

  return { open, setOpen, view, setView, sessionId, setSessionId, startNewConversation }
}

