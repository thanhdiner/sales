import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { Package } from 'lucide-react'
import { connectSocket, disconnectSocket, getSocket } from '@/services/socketService'
import { getClientAccessToken, getClientAccessTokenSession } from '@/utils/auth'
import {
  clearStoredNotifications,
  createOrderStatusNotification,
  getDesktopNotificationBody,
  loadStoredNotifications,
  prependNotification,
  saveStoredNotifications
} from '../components/NotificationBell/notificationUtils'

export default function useClientNotifications(user) {
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
      const notificationItem = createOrderStatusNotification(orderUpdate)

      setNotifications(prev => prependNotification(prev, notificationItem))

      notifApi.open({
        message: 'Cập nhật đơn hàng',
        description: getDesktopNotificationBody(orderUpdate),
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
  }, [notifApi, user?._id])

  return {
    notifications,
    setNotifications,
    notifContextHolder
  }
}
