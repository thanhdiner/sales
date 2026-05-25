import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { connectSocket, disconnectSocket, getSocket } from '@/services/realtime/socket'
import {
  getClientNotifications,
  markClientNotificationsRead
} from '@/services/client/commerce/notifications'
import { getClientAccessToken, getClientAccessTokenSession } from '@/utils/auth'
import {
  CLIENT_NOTIFICATIONS_UPDATED_EVENT,
  CLIENT_NOTIFICATIONS_STORAGE_KEY,
  clearStoredNotifications,
  getDesktopNotificationBody,
  loadStoredNotifications,
  mergeNotification,
  normalizeServerNotification,
  saveStoredNotifications
} from '../components/Header/NotificationBell/notificationUtils'

function hasClientToken() {
  return Boolean(getClientAccessToken() || getClientAccessTokenSession())
}

export default function useClientNotifications(user) {
  const { t } = useTranslation('clientHeader')
  const isAuthenticated = hasClientToken()

  const [notifications, setNotifications] = useState(() => {
    return hasClientToken() ? loadStoredNotifications() : []
  })

  const [notifApi, notifContextHolder] = notification.useNotification()

  useEffect(() => {
    if (!isAuthenticated) {
      clearStoredNotifications()
      return
    }

    saveStoredNotifications(notifications)
  }, [isAuthenticated, notifications])

  useEffect(() => {
    if (!isAuthenticated || !user?._id) return

    let ignore = false
    getClientNotifications({ limit: 50 })
      .then(response => {
        if (ignore) return
        const nextNotifications = Array.isArray(response?.notifications)
          ? response.notifications.map(normalizeServerNotification)
          : []
        setNotifications(nextNotifications)
      })
      .catch(() => {})

    return () => {
      ignore = true
    }
  }, [isAuthenticated, user?._id])

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
    if (!isAuthenticated || !user?._id) return

    connectSocket({ role: 'user', userId: user._id })
    const socket = getSocket()

    const handleNotificationCreated = payload => {
      const notificationItem = normalizeServerNotification(payload?.notification)
      setNotifications(prev => mergeNotification(prev, notificationItem))

      notifApi.open({
        message: notificationItem.title || t('notification.panelOrderTitle'),
        description: notificationItem.body || getDesktopNotificationBody(notificationItem, t),
        icon: <Package className="text-blue-500" />,
        placement: 'topRight',
        duration: 6
      })
    }

    const handleRead = payload => {
      const ids = Array.isArray(payload?.ids) ? payload.ids : []
      setNotifications(prev => prev.map(item => (payload?.all || ids.includes(item.id) ? { ...item, read: true, readAt: item.readAt || new Date().toISOString() } : item)))
    }

    socket.on('notification:created', handleNotificationCreated)
    socket.on('notification:read', handleRead)

    return () => {
      socket.off('notification:created', handleNotificationCreated)
      socket.off('notification:read', handleRead)
      disconnectSocket()
    }
  }, [isAuthenticated, notifApi, t, user?._id])

  const setNotificationsAndSync = updater => {
    setNotifications(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      return Array.isArray(next) ? next : prev
    })
  }

  return {
    notifications: isAuthenticated ? notifications : [],
    setNotifications: setNotificationsAndSync,
    markClientNotificationsRead,
    notifContextHolder
  }
}
