import { Button, Checkbox } from 'antd'
import { Archive, Check, ExternalLink, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  formatNotificationRelativeTime,
  getGroupIconClassName,
  getLocalizedNotificationField,
  getNotificationActionKey,
  getNotificationGroup,
  getNotificationIcon,
  getNotificationStatus,
  getPriorityClassName
} from '../utils'

const secondaryButtonClass =
  'min-w-[132px] justify-center rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
const dangerButtonClass =
  'min-w-[112px] justify-center rounded-lg !border-red-200 !bg-red-50 !text-red-600 hover:!border-red-300 hover:!bg-red-100 dark:!border-red-900/50 dark:!bg-red-950/30 dark:!text-red-300'

export default function NotificationItem({
  notification,
  selected,
  language,
  onToggleSelect,
  onView,
  onMarkRead,
  onArchive,
  onDelete
}) {
  const { t } = useTranslation('adminNotifications')
  const Icon = getNotificationIcon(notification)
  const group = getNotificationGroup(notification)
  const status = getNotificationStatus(notification)
  const title = getLocalizedNotificationField(notification, 'title', language)
  const message = getLocalizedNotificationField(notification, 'message', language)

  return (
    <article
      className={`rounded-xl border bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] transition hover:border-[var(--admin-border-strong)] ${
        status === 'unread' ? 'border-[var(--admin-border-strong)]' : 'border-[var(--admin-border)]'
      }`}
    >
      <div className="grid gap-3 lg:grid-cols-[auto_auto_minmax(0,1fr)_7rem_minmax(30rem,36rem)] lg:items-start">
        <div className="flex items-start gap-3 lg:block">
          <Checkbox checked={selected} onChange={() => onToggleSelect(notification._id)} />
          {status === 'unread' && <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-[var(--admin-accent)] lg:mt-4 lg:block" />}
        </div>

        <span className={`flex h-10 w-10 items-center justify-center rounded-lg border ${getGroupIconClassName(notification)}`}>
          <Icon className="h-4 w-4" />
        </span>

        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[var(--admin-text)]">{title}</h2>

          <p className="mt-1 text-sm leading-6 text-[var(--admin-text-muted)]">{message}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-2.5 py-1 text-xs font-medium text-[var(--admin-text-muted)]">
              {t('meta.type')}: {t(`groups.${group}`)}
            </span>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getPriorityClassName(notification.priority)}`}>
              {t('meta.priority')}: {t(`priorities.${notification.priority}`)}
            </span>
            <span className="rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-2.5 py-1 text-xs font-medium text-[var(--admin-text-muted)]">
              {t('meta.status')}: {t(`statuses.${status}`)}
            </span>
            {notification.actionRequired && (
              <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                {t('meta.actionRequired')}
              </span>
            )}
          </div>
        </div>

        <span className="text-xs font-medium text-[var(--admin-text-subtle)] lg:pt-1 lg:text-right">
          {formatNotificationRelativeTime(notification.createdAt, language)}
        </span>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Button icon={<ExternalLink className="h-4 w-4" />} onClick={() => onView(notification)} className={secondaryButtonClass}>
            {t(`actions.${getNotificationActionKey(notification)}`)}
          </Button>

          {status === 'unread' && (
            <Button icon={<Check className="h-4 w-4" />} onClick={() => onMarkRead(notification._id)} className={secondaryButtonClass}>
              {t('actions.markRead')}
            </Button>
          )}

          <Button icon={<Archive className="h-4 w-4" />} onClick={() => onArchive(notification._id)} className={secondaryButtonClass}>
            {t('actions.archive')}
          </Button>

          <Button icon={<Trash2 className="h-4 w-4" />} onClick={() => onDelete(notification._id)} className={dangerButtonClass}>
            {t('actions.delete')}
          </Button>
        </div>
      </div>
    </article>
  )
}
