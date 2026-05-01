import { useCallback, useRef, useState } from 'react'

import { apiFetch } from '../utils'

export function useChatHistory() {
  const [messages, setMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const historyRequestRef = useRef(0)

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

  return {
    messages,
    setMessages,
    messagesLoading,
    loadHistory
  }
}
