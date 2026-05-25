import { useCallback } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { useAdminResourceList } from '@/hooks/shared/adminResourceList'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import {
  createFlashSale,
  deleteFlashSale,
  getFlashSales,
  updateFlashSaleById
} from '@/services/admin/marketing/flashSale'
import { serializeFlashSaleForm } from '../utils/flashSaleHelpers'

export function useFlashSalesData() {
  const { t } = useTranslation('adminFlashSales')
  const language = useCurrentLanguage()
  const {
    items: flashSales,
    loading: tableLoading,
    fetching: tableFetching,
    refetch: fetchFlashSales,
    invalidate
  } = useAdminResourceList({
    resource: 'flash-sales',
    queryKeyDeps: { language },
    queryFn: () => getFlashSales(),
    selectItems: res => res?.flashSales,
    selectTotal: res => res?.flashSales?.length
  })

  const submitMutation = useMutation({
    mutationFn: async ({ editingItem, formData }) => {
      const dataToSend = serializeFlashSaleForm(formData)

      if (editingItem) {
        await updateFlashSaleById(editingItem._id, dataToSend)
        return 'update'
      }

      await createFlashSale(dataToSend)
      return 'create'
    },
    onSuccess: async action => {
      message.success(t(action === 'update' ? 'messages.updateSuccess' : 'messages.createSuccess'))
      await invalidate()
    },
    onError: err => message.error(err.message || t('messages.genericError'))
  })

  const deleteMutation = useMutation({
    mutationFn: deleteFlashSale,
    onSuccess: async () => {
      message.success(t('messages.deleteSuccess'))
      await invalidate()
    },
    onError: err => message.error(err.message || t('messages.deleteError'))
  })

  const submitFlashSale = useCallback(
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
  const deleteFlashSaleItem = useCallback(id => deleteMutation.mutate(id), [deleteMutation])

  return {
    flashSales,
    tableLoading,
    tableFetching,
    submitLoading: submitMutation.isPending,
    fetchFlashSales,
    submitFlashSale,
    deleteFlashSaleItem
  }
}
