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
    <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
        <span className="font-semibold text-gray-900 dark:text-gray-100">Thông báo</span>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Đọc tất cả
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-700">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <Bell className="mb-2 h-8 w-8 opacity-30" />
            <span className="text-sm">Chưa có thông báo nào</span>
          </div>
        ) : (
          notifications.map(notif => (
            <button
              type="button"
              key={`${notif.id}-${notif.time}`}
              onClick={() => onClickNotification(notif)}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                !notif.read ? 'bg-gray-50 dark:bg-gray-800/70' : ''
              }`}
            >
              <div
                className={`mt-0.5 shrink-0 rounded-lg p-1.5 ${
                  notif.read ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <Package className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-semibold ${
                    notif.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {notif.title}
                </p>

                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{notif.body}</p>

                <p className="mt-0.5 text-[10px] text-gray-400">{formatNotificationTime(notif.time)}</p>
              </div>

              {!notif.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gray-900 dark:bg-gray-100" />}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
