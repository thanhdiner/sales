import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAllOrders } from '@/services/admin/commerce/order'
import { useAsyncListData } from '@/hooks/shared/useAsyncListData'
import { stringFilter, useListSearchParams } from '@/hooks/shared/useListSearchParams'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { ORDERS_DEFAULT_PAGE_SIZE, ORDERS_SEARCH_DEBOUNCE_MS, getOrdersQueryParams } from '../utils'

const ORDER_FILTER_PARSERS = {
  keyword: stringFilter,
  status: stringFilter
}

export function useOrders() {
  const language = useCurrentLanguage()
  const { page, setPage, pageSize, setPageSize, filters, setFilters } = useListSearchParams({
    defaultPage: 1,
    defaultPageSize: ORDERS_DEFAULT_PAGE_SIZE,
    filterParsers: ORDER_FILTER_PARSERS
  })
  const [keyword, setKeyword] = useState(filters.keyword || '')
  const [debouncedKeyword, setDebouncedKeyword] = useState(filters.keyword || '')
  const [status, setStatus] = useState(filters.status || '')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const nextKeyword = filters.keyword || ''
    const nextStatus = filters.status || ''

    setKeyword(prev => (prev === nextKeyword ? prev : nextKeyword))
    setDebouncedKeyword(prev => (prev === nextKeyword ? prev : nextKeyword))
    setStatus(prev => (prev === nextStatus ? prev : nextStatus))
  }, [filters.keyword, filters.status])

  const updateFilters = useCallback(nextFilters => setFilters(nextFilters), [setFilters])

  const {
    items: orders,
    total,
    loading
  } = useAsyncListData(
    async () => {
      try {
        const response = await getAllOrders(
          getOrdersQueryParams({
            page,
            limit: pageSize,
            keyword: debouncedKeyword,
            status
          })
        )

        if (response?.success) {
          return {
            items: response.orders,
            total: response.total
          }
        }
      } catch (error) {
        console.error('Lỗi lấy danh sách đơn hàng:', error)
      }

      return {
        items: [],
        total: 0
      }
    },
    [debouncedKeyword, status, page, pageSize, language, refreshKey]
  )

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pagination = useMemo(() => ({ current: page, pageSize, total }), [page, pageSize, total])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmedKeyword = keyword.trim()
      setDebouncedKeyword(trimmedKeyword)
      updateFilters({ keyword: trimmedKeyword, status })
    }, ORDERS_SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeoutId)
  }, [keyword, status, updateFilters])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages, setPage])

  const handleKeywordChange = nextKeyword => {
    setKeyword(nextKeyword)
    setPage(1)
  }

  const handleStatusChange = nextStatus => {
    setStatus(nextStatus)
    setPage(1)
    setDebouncedKeyword(keyword.trim())
    updateFilters({ keyword: keyword.trim(), status: nextStatus })
  }

  const handleClearFilters = () => {
    setKeyword('')
    setDebouncedKeyword('')
    setStatus('')
    setPage(1)
    updateFilters({ keyword: '', status: '' })
  }

  const handlePageChange = (nextPage, nextPageSize = pageSize) => {
    if (nextPageSize !== pageSize) {
      setPageSize(nextPageSize)
      return
    }

    setPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  const refreshCurrentPage = () => setRefreshKey(key => key + 1)

  return {
    orders,
    loading,
    keyword,
    status,
    page,
    pageSize,
    total,
    totalPages,
    limit: pageSize,
    pagination,
    handleKeywordChange,
    handleStatusChange,
    handleClearFilters,
    handlePageChange,
    refreshCurrentPage
  }
}
