import { AlertCircle, Bell, CheckCircle2, Clock3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const statItems = [
  { key: 'total', icon: Bell },
  { key: 'unread', icon: Clock3 },
  { key: 'actionRequired', icon: AlertCircle },
  { key: 'today', icon: CheckCircle2 }
]

export default function AdminNotificationsStatsSection({ stats }) {
  const { t } = useTranslation('adminNotifications')

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {statItems.map(({ key, icon: Icon }) => (
        <div
          key={key}
          className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)]"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[var(--admin-text-muted)]">{t(`stats.${key}.label`)}</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--admin-text)]">{stats[key] || 0}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]">
              <Icon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-xs leading-5 text-[var(--admin-text-subtle)]">{t(`stats.${key}.description`)}</p>
        </div>
      ))}
    </section>
  )
}
