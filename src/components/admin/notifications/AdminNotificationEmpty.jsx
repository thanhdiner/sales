import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function AdminNotificationEmpty() {
  const { t } = useTranslation('adminNotifications')

  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center px-5 py-8 text-center">
      <Bell className="mb-3 h-9 w-9 text-[var(--admin-text-subtle)] opacity-60" />
      <p className="mb-0 text-sm font-medium text-[var(--admin-text)]">{t('dropdown.emptyTitle')}</p>
      <p className="mt-1 text-xs leading-5 text-[var(--admin-text-muted)]">{t('dropdown.emptyDescription')}</p>
    </div>
  )
}
