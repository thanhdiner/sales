import { useCallback, useMemo, useState } from 'react'
import { message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { createPromoCode, deletePromoCode, getPromoCodeDetail, getPromoCodes, updatePromoCode } from '@/services/admin/commerce/promoCode'
import { useAdminResourceList } from '@/hooks/shared/adminResourceList'
import { DEFAULT_PROMO_CODE_PAGINATION, getPromoCodeServerErrorMessage, normalizePromoCodeFormValues } from '../utils/promoCodeHelpers'

export function usePromoCodesData({ t = key => key, filters = {} } = {}) {
  const [selectedCode, setSelectedCode] = useState(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const {
    items: promoCodes,
    loading: listLoading,
    fetching: listFetching,
    pagination,
    page,
    pageSize,
    setPage,
    setPageSize,
    refetch,
    invalidate
  } = useAdminResourceList({
    resource: 'promo-codes',
    defaultPage: DEFAULT_PROMO_CODE_PAGINATION.current,
    defaultPageSize: DEFAULT_PROMO_CODE_PAGINATION.pageSize,
    query: filters,
    queryFn: query => getPromoCodes({ page: query.page, limit: query.limit, ...filters }),
    selectItems: res => res?.promoCodes,
    selectTotal: res => res?.total,
    onError: err => message.error(getPromoCodeServerErrorMessage(err, t, 'messages.fetchError'))
  })

  const submitMutation = useMutation({
    mutationFn: async ({ values, editingCode }) => {
      const formData = normalizePromoCodeFormValues(values)

      if (editingCode) {
        await updatePromoCode(editingCode._id, formData)
        return 'update'
      }

      await createPromoCode(formData)
      return 'create'
    },
    onSuccess: async action => {
      message.success(t(action === 'update' ? 'messages.updateSuccess' : 'messages.createSuccess'))
      await invalidate()
    },
    onError: error => message.error(getPromoCodeServerErrorMessage(error, t))
  })

  const deleteMutation = useMutation({
    mutationFn: deletePromoCode,
    onSuccess: async () => {
      message.success(t('messages.deleteSuccess'))
      await invalidate()
    },
    onError: err => message.error(getPromoCodeServerErrorMessage(err, t, 'messages.deleteError'))
  })

  const toggleMutation = useMutation({
    mutationFn: record => updatePromoCode(record._id, { isActive: !record.isActive }).then(() => record),
    onSuccess: async record => {
      message.success(
        t('messages.toggleSuccess', {
          action: record.isActive ? t('messages.toggleOff') : t('messages.toggleOn')
        })
      )
      await invalidate()
    },
    onError: err => message.error(getPromoCodeServerErrorMessage(err, t, 'messages.statusUpdateError'))
  })

  const refreshCurrentPage = useCallback(() => refetch(), [refetch])
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
  const handleSubmitPromoCode = useCallback(
    async args => {
      try {
        await submitMutation.mutateAsync(args)
        return true
      } catch {
        return false
      }
    },
    [submitMutation]
  )
  const handleDelete = useCallback(id => deleteMutation.mutate(id), [deleteMutation])
  const handleToggleStatus = useCallback(record => toggleMutation.mutate(record), [toggleMutation])
  const showDetail = useCallback(
    async record => {
      setDetailLoading(true)

      try {
        const res = await getPromoCodeDetail(record._id)
        setSelectedCode(res?.promoCode || null)
        setDetailModalVisible(true)
      } catch (err) {
        message.error(getPromoCodeServerErrorMessage(err, t, 'messages.detailError'))
      } finally {
        setDetailLoading(false)
      }
    },
    [t]
  )
  const closeDetail = useCallback(() => {
    setDetailModalVisible(false)
  }, [])
  const loading = useMemo(
    () => listLoading || detailLoading || submitMutation.isPending || deleteMutation.isPending || toggleMutation.isPending,
    [deleteMutation.isPending, detailLoading, listLoading, submitMutation.isPending, toggleMutation.isPending]
  )

  return {
    promoCodes,
    loading,
    fetching: listFetching,
    pagination: {
      ...DEFAULT_PROMO_CODE_PAGINATION,
      ...pagination,
      current: page,
      pageSize
    },
    selectedCode,
    detailModalVisible,
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
