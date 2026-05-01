import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  formatNotificationRelativeTime,
  getLocalizedNotificationField,
  getNotificationActionKey,
  getNotificationGroup,
  getNotificationIcon,
  isUrgentNotification
} from '@/pages/admin/Notifications/utils'

export default function AdminNotificationDropdownItem({ notification, language, onView }) {
  const { t } = useTranslation('adminNotifications')
  const Icon = getNotificationIcon(notification)
  const group = getNotificationGroup(notification)
  const title = getLocalizedNotificationField(notification, 'title', language)
  const message = getLocalizedNotificationField(notification, 'message', language)
  const unread = !notification.readAt
  const urgent = isUrgentNotification(notification)

  return (
    <article className="group border-b border-[var(--admin-border)] px-4 py-3 transition hover:bg-[var(--admin-surface-2)] last:border-b-0">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
        <div className="relative mt-0.5">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
              unread
                ? 'border-[var(--admin-accent-soft)] bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]'
                : 'border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)]'
            }`}
          >
            <Icon className="h-4 w-4" />
          </span>
          {unread && <span className="absolute -left-1 top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--admin-accent)] ring-2 ring-[var(--admin-surface)]" />}
        </div>

        <div className="min-w-0">
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--admin-text)]">{title}</h3>
            {urgent && (
              <span className="mt-0.5 inline-flex h-5 shrink-0 items-center gap-1 rounded-full border border-red-200 bg-red-50 px-1.5 text-[10px] font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                <AlertTriangle className="h-3 w-3" />
                {t('dropdown.urgent')}
              </span>
            )}
          </div>

          <p className="mt-1 truncate text-[13px] leading-5 text-[var(--admin-text-muted)]">{message}</p>

          <div className="mt-2 flex items-center gap-2 text-xs text-[var(--admin-text-subtle)]">
            <span>{t(`groups.${group}`)}</span>
            <span aria-hidden="true">·</span>
            <span>{t(`priorities.${notification.priority}`)}</span>
            <span aria-hidden="true">·</span>
            <span>{formatNotificationRelativeTime(notification.createdAt, language)}</span>
            <button
              type="button"
              onClick={() => onView(notification)}
              className="ml-auto rounded-md px-1.5 py-0.5 text-xs font-semibold text-[var(--admin-accent)] transition hover:bg-[var(--admin-accent-soft)]"
            >
              {t(`actions.${getNotificationActionKey(notification)}`)}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
