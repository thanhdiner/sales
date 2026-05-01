import { Empty, Skeleton } from 'antd'
import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import NotificationItem from './NotificationItem'

export default function NotificationsList({
  loading,
  notifications,
  selectedRowKeys,
  language,
  onToggleSelect,
  onView,
  onMarkRead,
  onArchive,
  onDelete
}) {
  const { t } = useTranslation('adminNotifications')

  return (
    <section className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--admin-text)]">{t('list.title')}</h2>
          <p className="mt-1 text-sm text-[var(--admin-text-muted)]">{t('list.description')}</p>
        </div>
        <p className="text-sm text-[var(--admin-text-subtle)]">{t('list.count', { count: notifications.length })}</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-4">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface-2)] py-12">
          <Empty
            image={<Bell className="mx-auto h-10 w-10 text-[var(--admin-text-subtle)]" />}
            description={
              <span className="text-sm text-[var(--admin-text-muted)]">
                {t('list.empty')}
              </span>
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notification => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              selected={selectedRowKeys.includes(notification._id)}
              language={language}
              onToggleSelect={onToggleSelect}
              onView={onView}
              onMarkRead={onMarkRead}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}
