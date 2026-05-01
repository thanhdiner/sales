import { useCallback, useEffect, useRef, useState } from 'react'

import { apiFetch } from '../utils'
import {
  CONVERSATION_PAGE_SIZE,
  SEARCH_DEBOUNCE_MS,
  getConversationStatusFilter,
  getPaginationTotal,
  hasPaginationTotal,
  mergeConversationPages
} from './chatConversationUtils'

export function useChatConversations({ activeTab, agentId }) {
  const [conversations, setConversations] = useState([])
  const [counts, setCounts] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [conversationsLoading, setConversationsLoading] = useState(true)
  const [conversationsLoadingMore, setConversationsLoadingMore] = useState(false)
  const [conversationPagination, setConversationPagination] = useState({
    hasMore: false,
    limit: CONVERSATION_PAGE_SIZE,
    page: 1,
    total: 0
  })
  const [refreshing, setRefreshing] = useState(false)

  const conversationsRequestRef = useRef(0)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim())
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [searchQuery])

  const loadConversations = useCallback(async ({ append = false, page = 1, silent = false } = {}) => {
    const requestId = conversationsRequestRef.current + 1
    conversationsRequestRef.current = requestId

    if (activeTab === 'mine' && !agentId) {
      setConversations([])
      setConversationPagination({
        hasMore: false,
        limit: CONVERSATION_PAGE_SIZE,
        page: 1,
        total: 0
      })
      setConversationsLoading(false)
      setConversationsLoadingMore(false)
      return
    }

    if (append) {
      setConversationsLoadingMore(true)
    } else if (!silent) {
      setConversationsLoading(true)
    }

    try {
      const params = new URLSearchParams({
        limit: String(CONVERSATION_PAGE_SIZE),
        page: String(page),
        status: getConversationStatusFilter(activeTab)
      })

      if (activeTab === 'mine') {
        params.set('agentId', agentId)
      }

      if (debouncedSearchQuery) {
        params.set('search', debouncedSearchQuery)
      }

      const response = await apiFetch(`chat/conversations?${params.toString()}`)

      if (conversationsRequestRef.current !== requestId) {
        return
      }

      const nextConversations = response.data || []
      const pagination = response.pagination || {}

      setConversationPagination({
        hasMore: Boolean(pagination.hasMore),
        limit: pagination.limit || CONVERSATION_PAGE_SIZE,
        page: pagination.page || page,
        total: Number.isFinite(pagination.total) ? pagination.total : nextConversations.length
      })
      setConversations(prevConversations =>
        append ? mergeConversationPages(prevConversations, nextConversations) : nextConversations
      )
    } catch {
      // Keep the current list visible if refresh fails.
    } finally {
      if (conversationsRequestRef.current === requestId) {
        setConversationsLoading(false)
        setConversationsLoadingMore(false)
      }
    }
  }, [activeTab, agentId, debouncedSearchQuery])

  const loadCounts = useCallback(async () => {
    try {
      const countRequests = [
        apiFetch('chat/conversations?status=unassigned&limit=1&page=1'),
        apiFetch('chat/conversations?status=open&limit=1&page=1'),
        apiFetch('chat/conversations?status=resolved&limit=1&page=1')
      ]

      if (agentId) {
        countRequests.push(apiFetch(`chat/conversations?status=open&agentId=${encodeURIComponent(agentId)}&limit=1&page=1`))
      }

      const [unassignedResponse, openResponse, resolvedResponse, mineResponse] = await Promise.all(countRequests)

      if (
        !hasPaginationTotal(unassignedResponse) ||
        !hasPaginationTotal(openResponse) ||
        !hasPaginationTotal(resolvedResponse) ||
        (agentId && !hasPaginationTotal(mineResponse))
      ) {
        const [legacyUnassignedResponse, legacyOpenResponse, legacyResolvedResponse] = await Promise.all([
          apiFetch('chat/conversations?status=unassigned&limit=1000'),
          apiFetch('chat/conversations?status=open&limit=1000'),
          apiFetch('chat/conversations?status=resolved&limit=1000')
        ])
        const legacyOpenConversations = legacyOpenResponse.data || []

        setCounts({
          unassigned: (legacyUnassignedResponse.data || []).length,
          mine: agentId
            ? legacyOpenConversations.filter(conversation => conversation.assignedAgent?.agentId === agentId).length
            : 0,
          open: legacyOpenConversations.length,
          resolved: (legacyResolvedResponse.data || []).length
        })
        return
      }

      setCounts({
        unassigned: getPaginationTotal(unassignedResponse),
        mine: agentId ? getPaginationTotal(mineResponse) : 0,
        open: getPaginationTotal(openResponse),
        resolved: getPaginationTotal(resolvedResponse)
      })
    } catch {
      // ignore
    }
  }, [agentId])

  useEffect(() => {
    void loadConversations()
  }, [loadConversations])

  useEffect(() => {
    void loadCounts()
  }, [loadCounts])

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value)
  }, [])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)

    try {
      await Promise.all([loadConversations({ page: 1 }), loadCounts()])
    } finally {
      setRefreshing(false)
    }
  }, [loadConversations, loadCounts])

  const loadMoreConversations = useCallback(() => {
    if (
      conversationsLoading ||
      conversationsLoadingMore ||
      !conversationPagination.hasMore
    ) {
      return
    }

    void loadConversations({
      append: true,
      page: conversationPagination.page + 1,
      silent: true
    })
  }, [
    conversationPagination.hasMore,
    conversationPagination.page,
    conversationsLoading,
    conversationsLoadingMore,
    loadConversations
  ])

  return {
    conversations,
    setConversations,
    counts,
    searchQuery,
    debouncedSearchQuery,
    conversationsLoading,
    conversationsLoadingMore,
    conversationPagination,
    setConversationPagination,
    refreshing,
    loadConversations,
    loadCounts,
    handleSearchChange,
    handleRefresh,
    loadMoreConversations
  }
}
