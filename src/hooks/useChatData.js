import { useState, useCallback, useEffect } from 'react'
import { chatService } from '@/services/chatService'

export function useChatData(sessionId, open, view, setUnread) {
  const [messages, setMessages] = useState([])
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [conversation, setConversation] = useState(null)
  const [isResolved, setIsResolved] = useState(false)

  const loadHistory = useCallback(async () => {
    try {
      const data = await chatService.getHistory(sessionId)
      setMessages(data || [])
      setHistoryLoaded(true)
    } catch { 
      setHistoryLoaded(true) 
    }
  }, [sessionId])

  const loadConversation = useCallback(async () => {
    try {
      const data = await chatService.getConversation(sessionId)
      if (data) {
        setConversation(data)
        setIsResolved(data.status === 'resolved')
      }
    } catch { /* skip */ }
  }, [sessionId])

  useEffect(() => {
    if (open && view === 'chat') {
      loadHistory()
      loadConversation()
      setUnread(0)
    }
  }, [open, view, loadHistory, loadConversation, setUnread])

  return { 
    messages, setMessages, 
    historyLoaded, setHistoryLoaded, 
    conversation, setConversation, 
    isResolved, setIsResolved 
  }
}
