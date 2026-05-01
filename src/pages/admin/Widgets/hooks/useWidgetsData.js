import { useCallback, useEffect, useState } from 'react'
import { Modal, message } from 'antd'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { deleteWidgetById, getAdminWidgets } from '@/services/admin/marketing/widget'
import { normalizeWidgetActiveValue } from '../utils'

export function useWidgets({ t = key => key } = {}) {
  const language = useCurrentLanguage()
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
      message.error(t('messages.fetchError'))
    } finally {
      setLoading(false)
    }
  }, [language, t])

  useEffect(() => {
    fetchWidgets()
  }, [fetchWidgets])

  const handleDeleteWidget = useCallback(
    widgetId => {
      Modal.confirm({
        className: 'admin-widgets-confirm-modal',
        wrapClassName: 'admin-widgets-confirm-modal',
        title: t('confirm.deleteTitle'),
        content: t('confirm.deleteContent'),
        okText: t('confirm.deleteOk'),
        cancelText: t('confirm.cancel'),
        okType: 'danger',
        onOk: async () => {
          try {
            await deleteWidgetById(widgetId)
            message.success(t('messages.deleteSuccess'))
            fetchWidgets()
          } catch {
            message.error(t('messages.deleteError'))
          }
        }
      })
    },
    [fetchWidgets, t]
  )

  return {
    widgets,
    loading,
    fetchWidgets,
    handleDeleteWidget
  }
}