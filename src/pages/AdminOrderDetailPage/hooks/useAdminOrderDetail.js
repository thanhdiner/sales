import { useCallback, useEffect, useRef, useState } from 'react'
import { message as antdMessage } from 'antd'
import { getOrderDetailAdmin, updateOrderStatus } from '@/services/adminOrdersService'

const SUCCESS_MESSAGE_DURATION_MS = 2500

export function useAdminOrderDetail(id) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [updating, setUpdating] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const successTimeoutRef = useRef(null)

  const clearSuccessTimeout = useCallback(() => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current)
      successTimeoutRef.current = null
    }
  }, [])

  const fetchOrder = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getOrderDetailAdmin(id)

      if (response?.success && response?.order) {
        setOrder(response.order)
        setStatus(response.order.status || '')
        return
      }

      setOrder(null)
      setStatus('')
    } catch {
      setOrder(null)
      setStatus('')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchOrder()

    return () => {
      clearSuccessTimeout()
    }
  }, [clearSuccessTimeout, fetchOrder])

  const handleStatusChange = value => {
    setStatus(value)
  }

  const handleUpdateStatus = async () => {
    setUpdating(true)

    try {
      const response = await updateOrderStatus(id, { status })

      if (response?.success) {
        setOrder(prev => (prev ? { ...prev, status } : prev))
        setSuccessMessage('Cập nhật trạng thái thành công!')
        antdMessage.success('Cập nhật trạng thái thành công!')

        clearSuccessTimeout()
        successTimeoutRef.current = setTimeout(() => {
          setSuccessMessage('')
          successTimeoutRef.current = null
        }, SUCCESS_MESSAGE_DURATION_MS)
      }
    } finally {
      setUpdating(false)
    }
  }

  return {
    order,
    loading,
    status,
    updating,
    successMessage,
    handleStatusChange,
    handleUpdateStatus
  }
}
