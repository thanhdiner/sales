import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import {
  createFlashSale,
  deleteFlashSale,
  getAdminFlashSales,
  updateFlashSaleById
} from '@/services/adminFlashSalesService'
import { serializeFlashSaleForm } from '../utils/flashSaleHelpers'

export function useAdminFlashSalesData() {
  const [flashSales, setFlashSales] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchFlashSales = useCallback(async () => {
    try {
      setTableLoading(true)
      const res = await getAdminFlashSales()
      setFlashSales(res.flashSales || [])
    } catch {
      setFlashSales([])
    } finally {
      setTableLoading(false)
    }
  }, [])

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
          message.success('Cập nhật thành công')
        } else {
          await createFlashSale(dataToSend)
          message.success('Tạo flash sale thành công')
        }

        await fetchFlashSales()
        return true
      } catch (err) {
        message.error(err.message || 'Có lỗi xảy ra')
        return false
      } finally {
        setSubmitLoading(false)
      }
    },
    [fetchFlashSales]
  )

  const deleteFlashSaleItem = useCallback(
    async id => {
      try {
        await deleteFlashSale(id)
        message.success('Đã xóa flash sale thành công')
        await fetchFlashSales()
      } catch (err) {
        message.error(err.message || 'Xóa thất bại')
      }
    },
    [fetchFlashSales]
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
