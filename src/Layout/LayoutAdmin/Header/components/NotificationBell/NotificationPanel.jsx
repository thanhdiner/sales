import { Bell, CheckCheck, Package, X } from 'lucide-react'
import { formatNotificationTime } from './notificationUtils'

export default function NotificationPanel({
  notifications,
  unreadCount,
  onClose,
  onMarkAllRead,
  onClickNotification
}) {
  return (
    <div className="admin-notification-panel absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl">
      <div className="admin-notification-panel-header flex items-center justify-between px-4 py-3">
        <span className="admin-notification-panel-title font-semibold">Thông báo</span>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button type="button" onClick={onMarkAllRead} className="admin-notification-panel-action flex items-center gap-1 text-xs font-medium">
              <CheckCheck className="h-3.5 w-3.5" />
              Đọc tất cả
            </button>
          )}

          <button type="button" onClick={onClose} className="admin-notification-close-btn rounded-md p-1">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="admin-notification-list max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="admin-notification-empty flex flex-col items-center justify-center py-10">
            <Bell className="mb-2 h-8 w-8 opacity-30" />
            <span className="text-sm">Chưa có thông báo nào</span>
          </div>
        ) : (
          notifications.map(notif => (
            <button
              type="button"
              key={`${notif.id}-${notif.time}`}
              onClick={() => onClickNotification(notif)}
              className={`admin-notification-item flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                !notif.read ? 'admin-notification-item-unread' : ''
              }`}
            >
              <div
                className={`admin-notification-item-icon mt-0.5 shrink-0 rounded-lg p-1.5 ${
                  notif.read ? 'admin-notification-item-icon-read' : 'admin-notification-item-icon-unread'
                }`}
              >
                <Package className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className={`admin-notification-item-title truncate text-sm font-semibold ${!notif.read ? 'admin-notification-item-title-unread' : ''}`}>
                  {notif.title}
                </p>

                <p className="admin-notification-item-body truncate text-xs">{notif.body}</p>

                <p className="admin-notification-item-time mt-0.5 text-[10px]">{formatNotificationTime(notif.time)}</p>
              </div>

              {!notif.read && <span className="admin-notification-item-dot mt-2 h-2 w-2 shrink-0 rounded-full" />}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
