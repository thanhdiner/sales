import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import {
  createPromoCode,
  deletePromoCode,
  getPromoCodeDetail,
  getPromoCodes,
  updatePromoCode
} from '@/services/adminPromoCodesService'
import {
  DEFAULT_PROMO_CODE_PAGINATION,
  normalizePromoCodeFormValues
} from '../utils/promoCodeHelpers'

export function useAdminPromoCodesData() {
  const [promoCodes, setPromoCodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCode, setSelectedCode] = useState(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [pagination, setPagination] = useState(DEFAULT_PROMO_CODE_PAGINATION)

  const fetchPromoCodes = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true)

    try {
      const res = await getPromoCodes({ page, limit: pageSize })

      setPromoCodes(res?.promoCodes || [])
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize,
        total: res?.total || 0
      }))
    } catch (err) {
      message.error('Lỗi khi lấy danh sách mã giảm giá')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPromoCodes()
  }, [fetchPromoCodes])

  const refreshCurrentPage = useCallback(() => {
    return fetchPromoCodes(pagination.current, pagination.pageSize)
  }, [fetchPromoCodes, pagination.current, pagination.pageSize])

  const handleTableChange = useCallback(
    tablePagination => {
      fetchPromoCodes(tablePagination.current, tablePagination.pageSize)
    },
    [fetchPromoCodes]
  )

  const handleDelete = useCallback(
    async id => {
      setLoading(true)

      try {
        await deletePromoCode(id)
        message.success('Đã xóa mã giảm giá thành công')
        await refreshCurrentPage()
      } catch (err) {
        message.error('Xóa mã giảm giá thất bại')
      } finally {
        setLoading(false)
      }
    },
    [refreshCurrentPage]
  )

  const handleSubmitPromoCode = useCallback(
    async ({ values, editingCode }) => {
      setLoading(true)

      try {
        const formData = normalizePromoCodeFormValues(values)

        if (editingCode) {
          await updatePromoCode(editingCode._id, formData)
          message.success('Cập nhật mã giảm giá thành công')
        } else {
          await createPromoCode(formData)
          message.success('Tạo mã giảm giá thành công')
        }

        await refreshCurrentPage()
        return true
      } catch (error) {
        message.error(error?.response?.data?.error || 'Có lỗi xảy ra')
        return false
      } finally {
        setLoading(false)
      }
    },
    [refreshCurrentPage]
  )

  const handleToggleStatus = useCallback(
    async record => {
      setLoading(true)

      try {
        await updatePromoCode(record._id, { isActive: !record.isActive })
        message.success(`Đã ${record.isActive ? 'tắt' : 'bật'} mã giảm giá`)
        await refreshCurrentPage()
      } catch (err) {
        message.error('Cập nhật trạng thái thất bại')
      } finally {
        setLoading(false)
      }
    },
    [refreshCurrentPage]
  )

  const showDetail = useCallback(async record => {
    setLoading(true)

    try {
      const res = await getPromoCodeDetail(record._id)
      setSelectedCode(res?.promoCode || null)
      setDetailModalVisible(true)
    } catch (err) {
      message.error('Không lấy được chi tiết mã')
    } finally {
      setLoading(false)
    }
  }, [])

  const closeDetail = useCallback(() => {
    setDetailModalVisible(false)
  }, [])

  return {
    promoCodes,
    loading,
    pagination,
    selectedCode,
    detailModalVisible,
    fetchPromoCodes,
    handleTableChange,
    handleDelete,
    handleSubmitPromoCode,
    handleToggleStatus,
    showDetail,
    closeDetail
  }
}
