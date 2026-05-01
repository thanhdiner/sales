import { Button } from 'antd'
import { CheckCheck, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const secondaryButtonClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
const primaryButtonClass =
  'rounded-lg !border-none !bg-[var(--admin-accent)] font-semibold !text-white hover:!opacity-90'

export default function NotificationsHeader({ onMarkAllRead, onOpenSettings }) {
  const { t } = useTranslation('adminNotifications')

  return (
    <section className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--admin-accent)]">
            {t('page.eyebrow')}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--admin-text)]">
            {t('page.title')}
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--admin-text-muted)]">
            {t('page.description')}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            icon={<CheckCheck className="h-4 w-4" />}
            size="large"
            onClick={onMarkAllRead}
            className={primaryButtonClass}
          >
            {t('actions.markAllRead')}
          </Button>
          <Button
            icon={<Settings className="h-4 w-4" />}
            size="large"
            onClick={onOpenSettings}
            className={secondaryButtonClass}
          >
            {t('actions.settings')}
          </Button>
        </div>
      </div>
    </section>
  )
}
