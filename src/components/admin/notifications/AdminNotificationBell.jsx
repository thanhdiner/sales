import { Bell } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getSocket } from '@/services/realtime/socket'
import {
  getAdminNotifications,
  markAdminNotificationsRead
} from '@/services/admin/commerce/notifications'
import {
  getDropdownPriorityScore,
  getLocalizedNotificationField,
  getNotificationActionRoute,
  isUrgentNotification
} from '@/pages/admin/Notifications/utils'
import AdminNotificationDropdown from './AdminNotificationDropdown'

const DROPDOWN_LIMIT = 8
const DROPDOWN_TYPES = new Set([
  'refund_requested',
  'payment_failed',
  'order_created',
  'order_cancelled',
  'payment_success',
  'low_stock',
  'out_of_stock',
  'review_created',
  'system_alert'
])

const filterDropdownItems = (items, activeTab) => {
  const relevantItems = items.filter(notification => DROPDOWN_TYPES.has(notification.type))
  if (activeTab === 'unread') return relevantItems.filter(notification => !notification.readAt)
  if (activeTab === 'urgent') return relevantItems.filter(isUrgentNotification)
  return relevantItems
}

export default function AdminNotificationBell() {
  const { t, i18n } = useTranslation('adminNotifications')
  const navigate = useNavigate()
  const language = i18n.resolvedLanguage || i18n.language
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const panelRef = useRef(null)

  useEffect(() => {
    let ignore = false

    const fetchNotifications = () => {
      getAdminNotifications({ page: 1, limit: 40 })
        .then(response => {
          if (!ignore) setNotifications(Array.isArray(response?.notifications) ? response.notifications : [])
        })
        .catch(() => {
          if (!ignore) setNotifications([])
        })
        .finally(() => {
          if (!ignore) setLoading(false)
        })
    }

    fetchNotifications()
    const intervalId = window.setInterval(fetchNotifications, 30000)

    return () => {
      ignore = true
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    const socket = getSocket()

    const handleCreated = payload => {
      const notification = payload?.notification
      if (!notification?._id) return

      setNotifications(prev => [notification, ...prev.filter(item => item._id !== notification._id)].slice(0, 40))

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(getLocalizedNotificationField(notification, 'title', language), {
          body: getLocalizedNotificationField(notification, 'message', language),
          icon: '/favicon.ico'
        })
      }
    }

    const handleRead = payload => {
      const readAt = new Date().toISOString()
      const ids = Array.isArray(payload?.ids) ? payload.ids : []
      setNotifications(prev =>
        prev.map(notification =>
          payload?.all || ids.includes(notification._id)
            ? { ...notification, readAt: notification.readAt || readAt }
            : notification
        )
      )
    }

    const handleDeleted = payload => {
      const ids = Array.isArray(payload?.ids) ? payload.ids : []
      setNotifications(prev => prev.filter(notification => !ids.includes(notification._id)))
    }

    socket.on('notification:created', handleCreated)
    socket.on('notification:read', handleRead)
    socket.on('notification:deleted', handleDeleted)

    return () => {
      socket.off('notification:created', handleCreated)
      socket.off('notification:read', handleRead)
      socket.off('notification:deleted', handleDeleted)
    }
  }, [language])

  useEffect(() => {
    const handlePointerDown = event => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const unreadCount = notifications.filter(notification => !notification.readAt).length
  const urgentCount = notifications.filter(notification => !notification.readAt && isUrgentNotification(notification)).length
  const dropdownItems = useMemo(
    () =>
      filterDropdownItems(notifications, activeTab)
        .slice()
        .sort((a, b) => {
          const priorityDelta = getDropdownPriorityScore(b) - getDropdownPriorityScore(a)
          if (priorityDelta !== 0) return priorityDelta
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        .slice(0, DROPDOWN_LIMIT),
    [activeTab, notifications]
  )

  const markAllRead = async () => {
    const readAt = new Date().toISOString()
    setNotifications(prev => prev.map(notification => (notification.readAt ? notification : { ...notification, readAt })))
    await markAdminNotificationsRead()
  }

  const markOneRead = async notificationId => {
    const readAt = new Date().toISOString()
    setNotifications(prev =>
      prev.map(notification => (notification._id === notificationId && !notification.readAt ? { ...notification, readAt } : notification))
    )
    await markAdminNotificationsRead([notificationId])
  }

  const handleView = async notification => {
    await markOneRead(notification._id)
    setOpen(false)
    navigate(getNotificationActionRoute(notification))
  }

  const handleViewAll = () => {
    setOpen(false)
    navigate('/admin/notifications')
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="admin-notification-btn relative flex h-10 w-10 items-center justify-center rounded-lg"
        title={t('dropdown.title')}
        aria-label={t('dropdown.title')}
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="admin-notification-badge absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <AdminNotificationDropdown
          items={dropdownItems}
          activeTab={activeTab}
          unreadCount={unreadCount}
          urgentCount={urgentCount}
          totalCount={notifications.length}
          loading={loading}
          language={language}
          onTabChange={setActiveTab}
          onMarkAllRead={markAllRead}
          onView={handleView}
          onViewAll={handleViewAll}
        />
      )}
    </div>
  )
}
