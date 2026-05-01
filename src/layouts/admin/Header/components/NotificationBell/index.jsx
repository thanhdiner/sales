import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NotificationPanel from './NotificationPanel'
import { MAX_NOTIFICATIONS, createOrderNotification } from './notificationUtils'

export default function NotificationBell({ onNewOrder }) {
  const { t, i18n } = useTranslation('adminLayout')
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const [hasNew, setHasNew] = useState(false)
  const panelRef = useRef(null)
  const navigate = useNavigate()
  const language = i18n.resolvedLanguage || i18n.language

  useEffect(() => {
    if (!onNewOrder) return

    const handler = order => {
      const notif = createOrderNotification(order, t, language)

      setNotifications(prev => [notif, ...prev].slice(0, MAX_NOTIFICATIONS))
      setHasNew(true)

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(t('notifications.browserTitle'), {
          body: notif.body,
          icon: '/favicon.ico'
        })
      }
    }

    const unsubscribe = onNewOrder(handler)

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [language, onNewOrder, t])

  useEffect(() => {
    const handle = e => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handle)

    return () => document.removeEventListener('mousedown', handle)
  }, [])

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setHasNew(false)
  }

  const handleClickNotif = notif => {
    setNotifications(prev => prev.map(n => (n.id === notif.id ? { ...n, read: true } : n)))
    setOpen(false)
    navigate(`/admin/orders/${notif.orderId}`)
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => {
          setOpen(o => !o)
          setHasNew(false)
        }}
        className="admin-notification-btn relative flex h-10 w-10 items-center justify-center rounded-lg"
        title={t('notifications.title')}
        aria-label={t('notifications.title')}
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="admin-notification-badge absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {hasNew && unreadCount === 0 && <span className="admin-notification-dot absolute right-1.5 top-1.5 h-2 w-2 rounded-full" />}
      </button>

      {open && (
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          onClose={() => setOpen(false)}
          onMarkAllRead={markAllRead}
          onClickNotification={handleClickNotif}
        />
      )}
    </div>
  )
}
