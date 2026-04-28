import { CheckCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AdminNotificationDropdownItem from './AdminNotificationDropdownItem'
import AdminNotificationEmpty from './AdminNotificationEmpty'
import AdminNotificationSkeleton from './AdminNotificationSkeleton'

const tabs = ['all', 'unread', 'urgent']

export default function AdminNotificationDropdown({
  items,
  loading = false,
  activeTab,
  unreadCount,
  urgentCount,
  totalCount,
  language,
  onTabChange,
  onMarkAllRead,
  onView,
  onViewAll
}) {
  const { t } = useTranslation('adminNotifications')

  return (
    <div className="absolute right-0 top-12 z-50 w-[400px] max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)] shadow-2xl shadow-slate-900/15 dark:shadow-black/40">
      <div className="flex min-h-[78px] items-start justify-between gap-4 border-b border-[var(--admin-border)] px-4 py-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[var(--admin-text)]">{t('dropdown.title')}</h2>
          <p className="mt-1 text-xs font-medium text-[var(--admin-text-muted)]">
            {t('dropdown.summary', { unread: unreadCount, urgent: urgentCount })}
          </p>
        </div>

        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-2.5 py-1.5 text-xs font-semibold text-[var(--admin-text-muted)] transition hover:border-[var(--admin-border-strong)] hover:text-[var(--admin-text)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          {t('dropdown.markRead')}
        </button>
      </div>

      <div className="flex h-12 items-center gap-2 border-b border-[var(--admin-border)] px-4">
        {tabs.map(tab => {
          const active = activeTab === tab

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? 'bg-[var(--admin-accent)] text-white'
                  : 'text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]'
              }`}
            >
              {t(`dropdown.tabs.${tab}`)}
            </button>
          )
        })}
      </div>

      <div className="max-h-[330px] overflow-y-auto">
        {loading ? (
          <AdminNotificationSkeleton />
        ) : items.length === 0 ? (
          <AdminNotificationEmpty />
        ) : (
          items.map(notification => (
            <AdminNotificationDropdownItem
              key={notification._id}
              notification={notification}
              language={language}
              onView={onView}
            />
          ))
        )}
      </div>

      <button
        type="button"
        onClick={onViewAll}
        className="flex h-14 w-full items-center justify-between border-t border-[var(--admin-border)] px-4 text-left text-sm font-semibold text-[var(--admin-accent)] transition hover:bg-[var(--admin-surface-2)]"
      >
        <span>{t('dropdown.viewAll')}</span>
        <span className="text-xs font-medium text-[var(--admin-text-subtle)]">{t('dropdown.total', { count: totalCount })}</span>
      </button>
    </div>
  )
}
