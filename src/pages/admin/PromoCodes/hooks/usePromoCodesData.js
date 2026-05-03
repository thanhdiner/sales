import { useCallback, useEffect, useMemo, useState } from 'react'
import { message } from 'antd'
import { createPromoCode, deletePromoCode, getPromoCodeDetail, getPromoCodes, updatePromoCode } from '@/services/admin/commerce/promoCode'
import { useListSearchParams } from '@/hooks/shared/useListSearchParams'
import { DEFAULT_PROMO_CODE_PAGINATION, getPromoCodeServerErrorMessage, normalizePromoCodeFormValues } from '../utils/promoCodeHelpers'

export function usePromoCodesData({ t = key => key, filters = {} } = {}) {
  const { page, setPage, pageSize, setPageSize } = useListSearchParams({
    defaultPage: DEFAULT_PROMO_CODE_PAGINATION.current,
    defaultPageSize: DEFAULT_PROMO_CODE_PAGINATION.pageSize
  })

  const [promoCodes, setPromoCodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCode, setSelectedCode] = useState(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [total, setTotal] = useState(DEFAULT_PROMO_CODE_PAGINATION.total)

  const pagination = useMemo(
    () => ({
      ...DEFAULT_PROMO_CODE_PAGINATION,
      current: page,
      pageSize,
      total
    }),
    [page, pageSize, total]
  )

  const fetchPromoCodes = useCallback(
    async (nextPage = page, nextPageSize = pageSize, nextFilters = {}) => {
      setLoading(true)

      try {
        const res = await getPromoCodes({ page: nextPage, limit: nextPageSize, ...nextFilters })

        setPromoCodes(res?.promoCodes || [])
        setTotal(res?.total || 0)
      } catch (err) {
        message.error(getPromoCodeServerErrorMessage(err, t, 'messages.fetchError'))
      } finally {
        setLoading(false)
      }
    },
    [page, pageSize, t]
  )

  useEffect(() => {
    fetchPromoCodes(page, pageSize, filters)
  }, [fetchPromoCodes, filters, page, pageSize])

  const refreshCurrentPage = useCallback(() => {
    return fetchPromoCodes(page, pageSize, filters)
  }, [fetchPromoCodes, filters, page, pageSize])

  const handleTableChange = useCallback(
    tablePagination => {
      const nextPage = tablePagination.current || DEFAULT_PROMO_CODE_PAGINATION.current
      const nextPageSize = tablePagination.pageSize || DEFAULT_PROMO_CODE_PAGINATION.pageSize

      if (nextPageSize !== pageSize) {
        setPageSize(nextPageSize)
        return
      }

      setPage(nextPage)
    },
    [pageSize, setPage, setPageSize]
  )

  const handleDelete = useCallback(
    async id => {
      setLoading(true)

      try {
        await deletePromoCode(id)
        message.success(t('messages.deleteSuccess'))
        await refreshCurrentPage()
      } catch (err) {
        message.error(getPromoCodeServerErrorMessage(err, t, 'messages.deleteError'))
      } finally {
        setLoading(false)
      }
    },
    [refreshCurrentPage, t]
  )

  const handleSubmitPromoCode = useCallback(
    async ({ values, editingCode }) => {
      setLoading(true)

      try {
        const formData = normalizePromoCodeFormValues(values)

        if (editingCode) {
          await updatePromoCode(editingCode._id, formData)
          message.success(t('messages.updateSuccess'))
        } else {
          await createPromoCode(formData)
          message.success(t('messages.createSuccess'))
        }

        await refreshCurrentPage()
        return true
      } catch (error) {
        message.error(getPromoCodeServerErrorMessage(error, t))
        return false
      } finally {
        setLoading(false)
      }
    },
    [refreshCurrentPage, t]
  )

  const handleToggleStatus = useCallback(
    async record => {
      setLoading(true)

      try {
        await updatePromoCode(record._id, { isActive: !record.isActive })
        message.success(
          t('messages.toggleSuccess', {
            action: record.isActive ? t('messages.toggleOff') : t('messages.toggleOn')
          })
        )
        await refreshCurrentPage()
      } catch (err) {
        message.error(getPromoCodeServerErrorMessage(err, t, 'messages.statusUpdateError'))
      } finally {
        setLoading(false)
      }
    },
    [refreshCurrentPage, t]
  )

  const showDetail = useCallback(
    async record => {
      setLoading(true)

      try {
        const res = await getPromoCodeDetail(record._id)
        setSelectedCode(res?.promoCode || null)
        setDetailModalVisible(true)
      } catch (err) {
        message.error(getPromoCodeServerErrorMessage(err, t, 'messages.detailError'))
      } finally {
        setLoading(false)
      }
    },
    [t]
  )

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
    refreshCurrentPage,
    setPage,
    handleTableChange,
    handleDelete,
    handleSubmitPromoCode,
    handleToggleStatus,
    showDetail,
    closeDetail
  }
}
