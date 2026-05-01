import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { connectSocket, disconnectSocket, getSocket } from '@/services/realtime/socket'
import { getClientAccessToken, getClientAccessTokenSession } from '@/utils/auth'
import {
  CLIENT_NOTIFICATIONS_UPDATED_EVENT,
  CLIENT_NOTIFICATIONS_STORAGE_KEY,
  clearStoredNotifications,
  createOrderStatusNotification,
  getDesktopNotificationBody,
  loadStoredNotifications,
  prependNotification,
  saveStoredNotifications
} from '../components/Header/NotificationBell/notificationUtils'

export default function useClientNotifications(user) {
  const { t } = useTranslation('clientHeader')
  const [notifications, setNotifications] = useState(() => loadStoredNotifications())
  const [notifApi, notifContextHolder] = notification.useNotification()

  useEffect(() => {
    const token = getClientAccessToken() || getClientAccessTokenSession()

    if (!token) {
      clearStoredNotifications()
      return
    }

    saveStoredNotifications(notifications)
  }, [notifications])

  useEffect(() => {
    const handleNotificationsUpdated = event => {
      const nextNotifications = event.detail?.notifications
      setNotifications(Array.isArray(nextNotifications) ? nextNotifications : loadStoredNotifications())
    }

    const handleStorage = event => {
      if (event.key === CLIENT_NOTIFICATIONS_STORAGE_KEY) {
        setNotifications(loadStoredNotifications())
      }
    }

    window.addEventListener(CLIENT_NOTIFICATIONS_UPDATED_EVENT, handleNotificationsUpdated)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(CLIENT_NOTIFICATIONS_UPDATED_EVENT, handleNotificationsUpdated)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  useEffect(() => {
    const token = getClientAccessToken() || getClientAccessTokenSession()

    if (!token) {
      setNotifications([])
      return
    }

    if (!user?._id) return

    connectSocket({ role: 'user', userId: user._id })
    const socket = getSocket()

    const handleStatusUpdate = ({ _id, status }) => {
      const orderUpdate = { _id, status }
      const notificationItem = createOrderStatusNotification(orderUpdate, t)

      setNotifications(prev => prependNotification(prev, notificationItem))

      notifApi.open({
        message: t('notification.panelOrderTitle'),
        description: getDesktopNotificationBody(orderUpdate, t),
        icon: <Package className="text-blue-500" />,
        placement: 'topRight',
        duration: 6
      })
    }

    socket.on('order_status_updated', handleStatusUpdate)

    return () => {
      socket.off('order_status_updated', handleStatusUpdate)
      disconnectSocket()
    }
  }, [notifApi, t, user?._id])

  return {
    notifications,
    setNotifications,
    notifContextHolder
  }
}
