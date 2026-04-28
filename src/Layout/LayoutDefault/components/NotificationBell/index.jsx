import { useEffect, useRef, useState } from 'react'
import { Badge } from 'antd'
import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NotificationPanel from './NotificationPanel'
import {
  getClientOrderRoute,
  getNotificationBellClassName,
  getUnreadCount,
  markAllNotificationsReadIfNeeded,
  markNotificationReadIfNeeded,
  requestDesktopNotificationPermission,
  shouldClosePanelAfterClick,
  shouldClosePanelAfterMarkAll
} from './notificationUtils'

export default function NotificationBell({ notifications = [], setNotifications }) {
  const { t } = useTranslation('clientHeader')
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const navigate = useNavigate()

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
    requestDesktopNotificationPermission()
  }, [])

  const unreadCount = getUnreadCount(notifications)

  const markAllRead = () => {
    setNotifications(prev => markAllNotificationsReadIfNeeded(prev))

    if (shouldClosePanelAfterMarkAll()) {
      setOpen(false)
    }
  }

  const handleClickNotif = notif => {
    setNotifications(prev => markNotificationReadIfNeeded(prev, notif.id))

    if (shouldClosePanelAfterClick()) {
      setOpen(false)
    }

    navigate(notif.orderId ? getClientOrderRoute(notif.orderId) : '/notifications')
  }

  const handleViewAll = () => {
    setOpen(false)
    navigate('/notifications')
  }

  return (
    <div className="header__action__notification relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        className={getNotificationBellClassName()}
        title={t('notification.bellTitle')}
        aria-label={unreadCount > 0 ? t('notification.ariaLabel', { count: unreadCount }) : t('notification.bellTitle')}
      >
        <Badge style={{ transition: 'all 0.1s' }} offset={[1, 1]} size="small" dot={unreadCount > 0}>
          <span className="header__action__icon-slot">
            <Bell className="header__action__notification--icon" />
          </span>
        </Badge>
      </button>

      {open && (
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={markAllRead}
          onClickNotification={handleClickNotif}
          onViewAll={handleViewAll}
        />
      )}
    </div>
  )
}
