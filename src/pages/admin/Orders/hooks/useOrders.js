import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAllOrders } from '@/services/admin/commerce/order'
import { useAdminResourceList } from '@/hooks/shared/adminResourceList'
import { stringFilter } from '@/hooks/shared/useListSearchParams'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { ORDERS_DEFAULT_PAGE_SIZE, ORDERS_SEARCH_DEBOUNCE_MS, getOrdersQueryParams } from '../utils'

const ORDER_FILTER_PARSERS = {
  keyword: stringFilter,
  status: stringFilter
}

export function useOrders() {
  const language = useCurrentLanguage()
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    items: orders,
    total,
    loading,
    pagination,
    refetch
  } = useAdminResourceList({
    resource: 'orders',
    defaultPage: 1,
    defaultPageSize: ORDERS_DEFAULT_PAGE_SIZE,
    filterParsers: ORDER_FILTER_PARSERS,
    queryKeyDeps: { language },
    queryFn: query => getAllOrders(getOrdersQueryParams(query)),
    selectItems: response => response?.orders,
    selectTotal: response => response?.total
  })
  const [keyword, setKeyword] = useState(filters.keyword || '')
  const [debouncedKeyword, setDebouncedKeyword] = useState(filters.keyword || '')
  const [status, setStatus] = useState(filters.status || '')

  useEffect(() => {
    const nextKeyword = filters.keyword || ''
    const nextStatus = filters.status || ''

    queueMicrotask(() => {
      setKeyword(prev => (prev === nextKeyword ? prev : nextKeyword))
      setDebouncedKeyword(prev => (prev === nextKeyword ? prev : nextKeyword))
      setStatus(prev => (prev === nextStatus ? prev : nextStatus))
    })
  }, [filters.keyword, filters.status])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmedKeyword = keyword.trim()
      setDebouncedKeyword(trimmedKeyword)
      setFilters({ keyword: trimmedKeyword, status })
    }, ORDERS_SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeoutId)
  }, [keyword, setFilters, status])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, setPage, totalPages])

  const handleKeywordChange = useCallback(
    nextKeyword => {
      setKeyword(nextKeyword)
      setPage(1)
    },
    [setPage]
  )

  const handleStatusChange = useCallback(
    nextStatus => {
      const trimmedKeyword = keyword.trim()
      setStatus(nextStatus)
      setPage(1)
      setDebouncedKeyword(trimmedKeyword)
      setFilters({ keyword: trimmedKeyword, status: nextStatus })
    },
    [keyword, setFilters, setPage]
  )

  const handleClearFilters = useCallback(() => {
    setKeyword('')
    setDebouncedKeyword('')
    setStatus('')
    setPage(1)
    setFilters({ keyword: '', status: '' })
  }, [setFilters, setPage])

  const handlePageChange = useCallback(
    (nextPage, nextPageSize = pageSize) => {
      if (nextPageSize !== pageSize) {
        setPageSize(nextPageSize)
        return
      }

      setPage(Math.min(Math.max(nextPage, 1), totalPages))
    },
    [pageSize, setPage, setPageSize, totalPages]
  )

  const refreshCurrentPage = useCallback(() => refetch(), [refetch])
  const resolvedPagination = useMemo(() => ({ ...pagination, total }), [pagination, total])

  return {
    orders,
    loading,
    keyword,
    debouncedKeyword,
    status,
    page,
    pageSize,
    total,
    totalPages,
    limit: pageSize,
    pagination: resolvedPagination,
    handleKeywordChange,
    handleStatusChange,
    handleClearFilters,
    handlePageChange,
    refreshCurrentPage
  }
}
