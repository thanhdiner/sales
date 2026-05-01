import { useCallback, useEffect, useState } from 'react'
import { getAllOrders } from '@/services/admin/commerce/order'
import { useAsyncListData } from '@/hooks/shared/useAsyncListData'
import { stringFilter, useListSearchParams } from '@/hooks/shared/useListSearchParams'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import {
  ORDERS_PAGE_LIMIT,
  ORDERS_SEARCH_DEBOUNCE_MS,
  getOrdersQueryParams
} from '../utils'

const ORDER_FILTER_PARSERS = {
  keyword: stringFilter,
  status: stringFilter
}

export function useOrders() {
  const language = useCurrentLanguage()
  const { page, setPage, filters, setFilters } = useListSearchParams({
    defaultPage: 1,
    filterParsers: ORDER_FILTER_PARSERS
  })
  const [keyword, setKeyword] = useState(filters.keyword || '')
  const [debouncedKeyword, setDebouncedKeyword] = useState(filters.keyword || '')
  const [status, setStatus] = useState(filters.status || '')

  useEffect(() => {
    const nextKeyword = filters.keyword || ''
    const nextStatus = filters.status || ''

    setKeyword(prev => (prev === nextKeyword ? prev : nextKeyword))
    setDebouncedKeyword(prev => (prev === nextKeyword ? prev : nextKeyword))
    setStatus(prev => (prev === nextStatus ? prev : nextStatus))
  }, [filters.keyword, filters.status])

  const updateFilters = useCallback(
    nextFilters => {
      setFilters(nextFilters)
    },
    [setFilters]
  )

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
            limit: ORDERS_PAGE_LIMIT,
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
    [debouncedKeyword, status, page, language]
  )

  const totalPages = Math.max(1, Math.ceil(total / ORDERS_PAGE_LIMIT))

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmedKeyword = keyword.trim()
      setDebouncedKeyword(trimmedKeyword)
      updateFilters({ keyword: trimmedKeyword, status })
    }, ORDERS_SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeoutId)
  }, [keyword, status, updateFilters])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages, setPage])

  const handleKeywordChange = keyword => {
    setKeyword(keyword)
    setPage(1)
  }

  const handleStatusChange = nextStatus => {
    setStatus(nextStatus)
    setPage(1)
    setDebouncedKeyword(keyword.trim())
    updateFilters({ keyword: keyword.trim(), status: nextStatus })
  }

  const handlePageChange = nextPage => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  return {
    orders,
    loading,
    keyword,
    status,
    page,
    total,
    totalPages,
    limit: ORDERS_PAGE_LIMIT,
    handleKeywordChange,
    handleStatusChange,
    handlePageChange
  }
}
