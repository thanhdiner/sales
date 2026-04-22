import { useEffect, useRef, useState } from 'react'
import { getAllOrders } from '@/services/adminOrdersService'
import {
  ADMIN_ORDERS_PAGE_LIMIT,
  ADMIN_ORDERS_SEARCH_DEBOUNCE_MS,
  getAdminOrdersQueryParams
} from '../utils'

export function useAdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const latestRequestRef = useRef(0)

  const totalPages = Math.max(1, Math.ceil(total / ADMIN_ORDERS_PAGE_LIMIT))

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedKeyword(keyword.trim())
    }, ADMIN_ORDERS_SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeoutId)
  }, [keyword])

  useEffect(() => {
    let isMounted = true
    const requestId = latestRequestRef.current + 1
    latestRequestRef.current = requestId

    const fetchOrders = async () => {
      setLoading(true)

      try {
        const response = await getAllOrders(
          getAdminOrdersQueryParams({
            page,
            limit: ADMIN_ORDERS_PAGE_LIMIT,
            keyword: debouncedKeyword,
            status
          })
        )

        if (!isMounted || requestId !== latestRequestRef.current) return

        if (response?.success) {
          setOrders(Array.isArray(response.orders) ? response.orders : [])
          setTotal(Number(response.total) || 0)
          return
        }

        setOrders([])
        setTotal(0)
      } catch (error) {
        if (isMounted && requestId === latestRequestRef.current) {
          console.error('Lỗi lấy danh sách đơn hàng:', error)
          setOrders([])
          setTotal(0)
        }
      } finally {
        if (isMounted && requestId === latestRequestRef.current) {
          setLoading(false)
        }
      }
    }

    fetchOrders()

    return () => {
      isMounted = false
    }
  }, [debouncedKeyword, status, page])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const handleKeywordChange = keyword => {
    setKeyword(keyword)
    setPage(1)
  }

  const handleStatusChange = status => {
    setStatus(status)
    setDebouncedKeyword(keyword.trim())
    setPage(1)
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
    limit: ADMIN_ORDERS_PAGE_LIMIT,
    handleKeywordChange,
    handleStatusChange,
    handlePageChange
  }
}
