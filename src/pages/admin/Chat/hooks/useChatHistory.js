import { useCallback, useRef, useState } from 'react'

import { apiFetch } from '../utils'

const CHAT_HISTORY_PAGE_SIZE = 30

function getMessageKey(message) {
  return message?._id?.toString?.() || message?._id || `${message?.createdAt || ''}-${message?.sender || ''}-${message?.message || ''}`
}

function buildHistoryPath(sessionId, params = {}) {
  const searchParams = new URLSearchParams({
    internal: 'true',
    limit: String(CHAT_HISTORY_PAGE_SIZE)
  })

  if (params.before) {
    searchParams.set('before', params.before)
  }

  if (params.beforeId) {
    searchParams.set('beforeId', params.beforeId)
  }

  return `chat/history/${sessionId}?${searchParams.toString()}`
}

function getNextBefore(messages = [], fallback = null) {
  return messages[0]?.createdAt || fallback
}

function getNextBeforeId(messages = [], fallback = null) {
  return messages[0]?._id || fallback
}

export function useChatHistory({ suppressNextMessagesAutoScrollRef } = {}) {
  const [messages, setMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [messagesLoadingMore, setMessagesLoadingMore] = useState(false)
  const [historyPagination, setHistoryPagination] = useState({
    hasMore: false,
    nextBefore: null,
    nextBeforeId: null
  })
  const historyRequestRef = useRef(0)
  const historyLoadingMoreRef = useRef(false)

  const loadHistory = useCallback(async sessionId => {
    const requestId = historyRequestRef.current + 1
    historyRequestRef.current = requestId

    setMessagesLoading(true)
    setMessagesLoadingMore(false)
    historyLoadingMoreRef.current = false
    setHistoryPagination({ hasMore: false, nextBefore: null, nextBeforeId: null })

    try {
      const response = await apiFetch(buildHistoryPath(sessionId))
      const nextMessages = response.data || []

      if (historyRequestRef.current === requestId) {
        setMessages(nextMessages)
        setHistoryPagination({
          hasMore: !!response.pagination?.hasMore,
          nextBefore: response.pagination?.nextBefore || getNextBefore(nextMessages),
          nextBeforeId: response.pagination?.nextBeforeId || getNextBeforeId(nextMessages)
        })
      }
    } catch {
      if (historyRequestRef.current === requestId) {
        setMessages([])
        setHistoryPagination({ hasMore: false, nextBefore: null, nextBeforeId: null })
      }
    } finally {
      if (historyRequestRef.current === requestId) {
        setMessagesLoading(false)
      }
    }
  }, [])

  const loadOlderMessages = useCallback(async ({ sessionId, viewport } = {}) => {
    if (!sessionId || !viewport || messagesLoading || historyLoadingMoreRef.current) {
      return
    }

    if (!historyPagination.hasMore || !historyPagination.nextBefore) {
      return
    }

    const requestId = historyRequestRef.current
    const previousScrollHeight = viewport.scrollHeight
    const previousScrollTop = viewport.scrollTop

    historyLoadingMoreRef.current = true
    setMessagesLoadingMore(true)

    try {
      const response = await apiFetch(buildHistoryPath(sessionId, {
        before: historyPagination.nextBefore,
        beforeId: historyPagination.nextBeforeId
      }))
      const olderMessages = response.data || []

      if (historyRequestRef.current !== requestId) {
        return
      }

      if (olderMessages.length > 0) {
        suppressNextMessagesAutoScrollRef.current = true
        setMessages(prevMessages => {
          const existingKeys = new Set(prevMessages.map(getMessageKey))
          const uniqueOlderMessages = olderMessages.filter(message => !existingKeys.has(getMessageKey(message)))
          return [...uniqueOlderMessages, ...prevMessages]
        })

        requestAnimationFrame(() => {
          viewport.scrollTop = viewport.scrollHeight - previousScrollHeight + previousScrollTop
        })
      }

      setHistoryPagination({
        hasMore: !!response.pagination?.hasMore,
        nextBefore: response.pagination?.nextBefore || getNextBefore(olderMessages, historyPagination.nextBefore),
        nextBeforeId: response.pagination?.nextBeforeId || getNextBeforeId(olderMessages, historyPagination.nextBeforeId)
      })
    } catch {
      setHistoryPagination(prevPagination => ({ ...prevPagination, hasMore: false }))
    } finally {
      if (historyRequestRef.current === requestId) {
        historyLoadingMoreRef.current = false
        setMessagesLoadingMore(false)
      }
    }
  }, [
    historyPagination.hasMore,
    historyPagination.nextBefore,
    historyPagination.nextBeforeId,
    messagesLoading,
    suppressNextMessagesAutoScrollRef
  ])

  return {
    historyHasMore: historyPagination.hasMore,
    messages,
    setMessages,
    messagesLoading,
    messagesLoadingMore,
    loadHistory,
    loadOlderMessages
  }
}
