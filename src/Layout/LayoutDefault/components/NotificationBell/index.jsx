import { useEffect, useRef, useState } from 'react'
import { Badge } from 'antd'
import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NotificationPanel from './NotificationPanel'
import {
  getClientOrderRoute,
  getNotificationAriaLabel,
  getNotificationBellClassName,
  getNotificationButtonTitle,
  getNotificationNewDotClassName,
  getNotificationNewDotVisible,
  getUnreadCount,
  markAllNotificationsReadIfNeeded,
  markNotificationReadIfNeeded,
  requestDesktopNotificationPermission,
  shouldClosePanelAfterClick,
  shouldClosePanelAfterMarkAll
} from './notificationUtils'

export default function NotificationBell({ notifications = [], setNotifications }) {
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
  const showNewDot = getNotificationNewDotVisible(notifications)

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

    navigate(getClientOrderRoute(notif.orderId))
  }

  return (
    <div className="header__action__notification relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        className={getNotificationBellClassName()}
        title={getNotificationButtonTitle()}
        aria-label={getNotificationAriaLabel(unreadCount)}
      >
        <Badge style={{ transition: 'all 0.1s' }} offset={[5, -5]} size="small" count={unreadCount} overflowCount={99}>
          <span className="header__action__icon-slot">
            <Bell className="header__action__notification--icon" />
          </span>
        </Badge>

        {showNewDot && <span className={getNotificationNewDotClassName()} />}
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
