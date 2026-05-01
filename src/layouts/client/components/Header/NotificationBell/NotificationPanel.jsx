import { Bell, CheckCheck, Clock3, Package, PackageCheck, ShoppingCart, Truck, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import {
  createNotificationRowKey,
  formatNotificationRelativeTime,
  getNotificationItemBody,
  getNotificationItemTime,
  getNotificationItemTitle,
  shouldShowEmptyState
} from './notificationUtils'

const iconByStatus = {
  pending: ShoppingCart,
  confirmed: Package,
  shipping: Truck,
  completed: PackageCheck,
  cancelled: XCircle
}

const getIconClassName = notif => {
  if (notif.read) {
    return 'border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }

  if (notif.status === 'completed') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
  }

  if (notif.status === 'cancelled') {
    return 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300'
  }

  if (notif.status === 'shipping') {
    return 'border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300'
  }

  return 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300'
}

export default function NotificationPanel({ notifications, unreadCount, onMarkAllRead, onClickNotification, onViewAll }) {
  const { t } = useTranslation('clientHeader')
  const language = useCurrentLanguage()

  return (
    <div className="client-notification-panel absolute right-0 top-12 z-50 max-h-[520px] w-[400px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[18px] border border-gray-200 bg-white text-gray-900 shadow-2xl shadow-slate-900/15 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:shadow-black/40">
      <div className="m-3 mb-0 flex min-h-[76px] items-center justify-between gap-3 rounded-2xl border border-dashed border-gray-200 px-4 py-3 dark:border-gray-700">
        <div>
          <h3 className="mb-1 text-xl font-bold leading-tight tracking-normal text-gray-950 dark:text-white">
            {t('notification.panelTitle')}
          </h3>

          <p className="mb-0 text-sm leading-5 text-gray-500 dark:text-gray-400">
            {t('notification.unreadSummary', { count: unreadCount })}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
          >
            <CheckCheck className="h-4 w-4" />
            {t('notification.markAllRead')}
          </button>
        )}
      </div>

      <div className="m-3 max-h-[340px] rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
        {shouldShowEmptyState(notifications) ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center px-6 py-10 text-center text-gray-500 dark:text-gray-400">
            <Bell className="mb-3 h-9 w-9 opacity-40" />
            <span className="text-sm">{t('notification.empty')}</span>
          </div>
        ) : (
          <div className="max-h-[338px] overflow-y-auto px-3 py-1">
            {notifications.map(notif => {
              const title = getNotificationItemTitle(notif)
              const body = getNotificationItemBody(notif)
              const Icon = iconByStatus[notif.status] || Package

              return (
                <button
                  type="button"
                  key={createNotificationRowKey(notif)}
                  onClick={() => onClickNotification(notif)}
                  className="group flex min-h-[84px] w-full items-start gap-3 border-b border-gray-200 py-3 text-left transition last:border-b-0 hover:bg-gray-50/80 dark:border-gray-700 dark:hover:bg-gray-800/80"
                  aria-label={`${t('notification.openNotification')}: ${title}`}
                >
                  <span className={`mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${getIconClassName(notif)}`}>
                    <Icon className="h-5 w-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-sm font-bold leading-5 ${notif.read ? 'text-gray-700 dark:text-gray-200' : 'text-gray-950 dark:text-white'}`}>
                      {title}
                    </span>

                    <span className="mt-1 line-clamp-2 block text-sm leading-5 text-gray-600 dark:text-gray-300">
                      {body}
                    </span>

                    <span className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock3 className="h-3 w-3" />
                      {formatNotificationRelativeTime(getNotificationItemTime(notif), language)}
                    </span>
                  </span>

                  <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden="true">
                    {!notif.read && <span className="h-2.5 w-2.5 rounded-full bg-gray-950 dark:bg-white" />}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="m-3 mt-0 flex h-[64px] items-center rounded-2xl border border-dashed border-gray-200 p-2 dark:border-gray-700">
        <button
          type="button"
          onClick={onViewAll}
          className="flex h-11 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-base font-semibold text-gray-900 transition hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
        >
          {t('notification.viewAll')}
        </button>
      </div>
    </div>
  )
}
