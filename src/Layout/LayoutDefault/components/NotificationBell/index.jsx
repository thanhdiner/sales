import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NotificationPanel from './NotificationPanel'
import {
  getClientOrderRoute,
  getNotificationAriaLabel,
  getNotificationBadgeText,
  getNotificationBellClassName,
  getNotificationButtonTitle,
  getNotificationNewDotClassName,
  getNotificationNewDotVisible,
  getUnreadCount,
  markAllNotificationsReadIfNeeded,
  markNotificationReadIfNeeded,
  requestDesktopNotificationPermission,
  shouldClosePanelAfterClick,
  shouldClosePanelAfterMarkAll,
  shouldShowUnreadBadge
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
        <span className="header__action__icon-slot">
          <Bell className="header__action__notification--icon" />
        </span>

        {shouldShowUnreadBadge(unreadCount) && (
          <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-semibold text-white ring-2 ring-white dark:bg-gray-100 dark:text-gray-900 dark:ring-gray-800">
            {getNotificationBadgeText(unreadCount)}
          </span>
        )}

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
