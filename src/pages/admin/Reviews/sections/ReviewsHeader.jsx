import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function ReviewsHeader({ onRefresh }) {
  const { t } = useTranslation('adminReviews')

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-[var(--admin-text)]">{t('page.title')}</h1>

        <p className="mt-1 text-sm text-[var(--admin-text-muted)]">{t('page.description')}</p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="flex w-fit items-center gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2 text-sm font-medium text-[var(--admin-text-muted)] shadow-sm transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]"
      >
        <RefreshCw size={14} strokeWidth={1.8} />
        {t('page.refresh')}
      </button>
    </div>
  )
}
