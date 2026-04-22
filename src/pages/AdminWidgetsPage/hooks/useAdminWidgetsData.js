import { useCallback, useEffect, useState } from 'react'
import { Modal, message } from 'antd'
import { deleteWidgetById, getAdminWidgets } from '@/services/adminWidgetsService'
import { normalizeWidgetActiveValue } from '../utils'

export function useAdminWidgetsData() {
  const [widgets, setWidgets] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchWidgets = useCallback(async () => {
    setLoading(true)

    try {
      const res = await getAdminWidgets()
      setWidgets(
        (res.data || []).map(widget => ({
          ...widget,
          isActive: normalizeWidgetActiveValue(widget.isActive)
        }))
      )
    } catch {
      message.error('Không thể tải danh sách widget')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWidgets()
  }, [fetchWidgets])

  const handleDeleteWidget = widgetId => {
    Modal.confirm({
      title: 'Xác nhận xóa widget',
      content: 'Bạn có chắc chắn muốn xóa widget này không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteWidgetById(widgetId)
          message.success('Đã xóa widget')
          fetchWidgets()
        } catch {
          message.error('Không thể xóa widget')
        }
      }
    })
  }

  return {
    widgets,
    loading,
    fetchWidgets,
    handleDeleteWidget
  }
}
