import { useCallback, useEffect, useRef, useState } from 'react'
import { message as antdMessage } from 'antd'
import { useTranslation } from 'react-i18next'
import { getOrderDetail, updateOrderStatus } from '@/services/admin/commerce/order'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'

const SUCCESS_MESSAGE_DURATION_MS = 2500

export function useDetail(id) {
  const { t } = useTranslation('adminOrderDetail')
  const language = useCurrentLanguage()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
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
      const response = await getOrderDetail(id)

      if (response?.success && response?.order) {
        setOrder(response.order)
        setStatus(response.order.status || '')
        setPaymentStatus(response.order.paymentStatus || '')
        return
      }

      setOrder(null)
      setStatus('')
      setPaymentStatus('')
    } catch {
      setOrder(null)
      setStatus('')
      setPaymentStatus('')
    } finally {
      setLoading(false)
    }
  }, [id, language])

  useEffect(() => {
    fetchOrder()

    return () => {
      clearSuccessTimeout()
    }
  }, [clearSuccessTimeout, fetchOrder])

  const handleStatusChange = value => {
    setStatus(value)
  }

  const handlePaymentStatusChange = value => {
    setPaymentStatus(value)
  }

  const handleUpdateStatus = async () => {
    setUpdating(true)

    try {
      const response = await updateOrderStatus(id, { status, paymentStatus })

      if (response?.success) {
        const nextOrder = response.order || (order ? { ...order, status, paymentStatus } : null)
        const successText = t('messages.updateSuccess')

        setOrder(nextOrder)
        setStatus(nextOrder?.status || status)
        setPaymentStatus(nextOrder?.paymentStatus || paymentStatus)
        setSuccessMessage(successText)
        antdMessage.success(successText)

        clearSuccessTimeout()
        successTimeoutRef.current = setTimeout(() => {
          setSuccessMessage('')
          successTimeoutRef.current = null
        }, SUCCESS_MESSAGE_DURATION_MS)
      }
    } catch (error) {
      antdMessage.error(error?.response?.error || error?.response?.message || error?.message || t('messages.updateError'))
    } finally {
      setUpdating(false)
    }
  }

  return {
    order,
    loading,
    status,
    paymentStatus,
    updating,
    successMessage,
    handleStatusChange,
    handlePaymentStatusChange,
    handleUpdateStatus
  }
}
