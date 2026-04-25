import { Bell, CheckCheck, Package, X } from 'lucide-react'
import {
  createNotificationRowKey,
  formatNotificationTime,
  getMarkAllReadLabel,
  getNotificationCloseButtonClassName,
  getNotificationCloseLabel,
  getNotificationEmptyLabel,
  getNotificationEmptyTextClassName,
  getNotificationItemAriaLabel,
  getNotificationItemBody,
  getNotificationItemTime,
  getNotificationItemTitle,
  getNotificationMarkAllClassName,
  getNotificationPanelBodyClassName,
  getNotificationPanelEmptyIconClassName,
  getNotificationPanelEmptyWrapperClassName,
  getNotificationPanelHeaderClassName,
  getNotificationPanelIconWrapClassName,
  getNotificationPanelListClassName,
  getNotificationPanelRowClassName,
  getNotificationPanelTimeClassName,
  getNotificationPanelTitle,
  getNotificationPanelTitleClassName,
  getNotificationTitleTextClassName,
  getNotificationUnreadDotClassName,
  getUnreadLabel,
  shouldShowEmptyState
} from './notificationUtils'

export default function NotificationPanel({
  notifications,
  unreadCount,
  onClose,
  onMarkAllRead,
  onClickNotification
}) {
  return (
    <div className="client-notification-panel absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-blue-100 bg-white text-gray-900 shadow-xl shadow-slate-900/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:shadow-black/30">
      <div className={getNotificationPanelHeaderClassName()}>
        <div>
          <span className={getNotificationTitleTextClassName()}>{getNotificationPanelTitle(notifications)}</span>
          {unreadCount > 0 && <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">{getUnreadLabel(unreadCount)}</p>}
        </div>


        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className={getNotificationMarkAllClassName()}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              {getMarkAllReadLabel()}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className={getNotificationCloseButtonClassName()}
            aria-label={getNotificationCloseLabel()}
            title={getNotificationCloseLabel()}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={getNotificationPanelListClassName()}>
        {shouldShowEmptyState(notifications) ? (
          <div className={getNotificationPanelEmptyWrapperClassName()}>
            <Bell className={getNotificationPanelEmptyIconClassName()} />
            <span className={getNotificationEmptyTextClassName()}>{getNotificationEmptyLabel()}</span>
          </div>
        ) : (
          notifications.map(notif => (
            <button
              type="button"
              key={createNotificationRowKey(notif)}
              onClick={() => onClickNotification(notif)}
              className={getNotificationPanelRowClassName(notif)}
              aria-label={getNotificationItemAriaLabel(notif)}
            >
              <div className={getNotificationPanelIconWrapClassName(notif)}>
                <Package className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>

              <div className="min-w-0 flex-1">
                <p className={getNotificationPanelTitleClassName(notif)}>{getNotificationItemTitle(notif)}</p>

                <p className={getNotificationPanelBodyClassName()}>{getNotificationItemBody(notif)}</p>

                <p className={getNotificationPanelTimeClassName()}>{formatNotificationTime(getNotificationItemTime(notif))}</p>
              </div>

              {!notif.read && <span className={getNotificationUnreadDotClassName()} />}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
