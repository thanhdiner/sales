import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
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
  const [flashSales, setFlashSales] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchFlashSales = useCallback(async () => {
    try {
      setTableLoading(true)
      const res = await getFlashSales()
      setFlashSales(res.flashSales || [])
    } catch {
      setFlashSales([])
    } finally {
      setTableLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchFlashSales()
  }, [fetchFlashSales])

  const submitFlashSale = useCallback(
    async ({ editingItem, formData }) => {
      setSubmitLoading(true)

      try {
        const dataToSend = serializeFlashSaleForm(formData)

        if (editingItem) {
          await updateFlashSaleById(editingItem._id, dataToSend)
          message.success(t('messages.updateSuccess'))
        } else {
          await createFlashSale(dataToSend)
          message.success(t('messages.createSuccess'))
        }

        await fetchFlashSales()
        return true
      } catch (err) {
        message.error(err.message || t('messages.genericError'))
        return false
      } finally {
        setSubmitLoading(false)
      }
    },
    [fetchFlashSales, t]
  )

  const deleteFlashSaleItem = useCallback(
    async id => {
      try {
        await deleteFlashSale(id)
        message.success(t('messages.deleteSuccess'))
        await fetchFlashSales()
      } catch (err) {
        message.error(err.message || t('messages.deleteError'))
      }
    },
    [fetchFlashSales, t]
  )


  return {
    flashSales,
    tableLoading,
    submitLoading,
    fetchFlashSales,
    submitFlashSale,
    deleteFlashSaleItem
  }
}
