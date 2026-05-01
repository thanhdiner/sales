import { useEffect, useState } from 'react'
import { getSocket } from '@/services/realtime/socket'

const CHAT_VISIBLE_STORAGE_KEY = 'chatVisible'
const LEGACY_CHAT_OPEN_STORAGE_KEY = 'chatOpen'
const RESOLVED_SESSION_STORAGE_KEY = 'chatResolvedSessionId'

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

export function markSessionResolved(sessionId) {
  if (sessionId) localStorage.setItem(RESOLVED_SESSION_STORAGE_KEY, sessionId)
}

export function isSessionResolved(sessionId) {
  return Boolean(sessionId && localStorage.getItem(RESOLVED_SESSION_STORAGE_KEY) === sessionId)
}

export function clearResolvedSessionMarker(sessionId) {
  if (sessionId && localStorage.getItem(RESOLVED_SESSION_STORAGE_KEY) === sessionId) {
    localStorage.removeItem(RESOLVED_SESSION_STORAGE_KEY)
  }
}

export function useChatSession() {
  const [open, setOpenState] = useState(() => localStorage.getItem(CHAT_VISIBLE_STORAGE_KEY) === 'true')
  const [view, setViewState] = useState(() => localStorage.getItem('chatView') || 'home')
  const [sessionId, setSessionId] = useState(getSessionId)

  useEffect(() => {
    localStorage.removeItem(LEGACY_CHAT_OPEN_STORAGE_KEY)
  }, [])

  const setOpen = (val) => {
    setOpenState(prev => {
      const nextOpen = typeof val === 'function' ? val(prev) : val

      if (nextOpen) {
        localStorage.setItem(CHAT_VISIBLE_STORAGE_KEY, 'true')
      } else {
        localStorage.removeItem(CHAT_VISIBLE_STORAGE_KEY)
      }

      localStorage.removeItem(LEGACY_CHAT_OPEN_STORAGE_KEY)
      return nextOpen
    })
  }

  const setView = (val) => {
    setViewState(val)
    localStorage.setItem('chatView', val)
  }

  const startNewConversation = ({ setMessages, setConversation, setIsResolved, setHistoryLoaded }) => {
    const newSid = newSessionId()
    clearResolvedSessionMarker(newSid)
    setSessionId(newSid)
    setMessages([])
    setConversation(null)
    setIsResolved(false)
    setHistoryLoaded(false)
    getSocket().emit('chat:join', { sessionId: newSid })
    setView('chat')
    return newSid
  }

  return { open, setOpen, view, setView, sessionId, setSessionId, startNewConversation }
}

