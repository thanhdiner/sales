import { useTranslation } from 'react-i18next'
import { getOrdersPageNumbers, getOrdersSummary } from '../utils'

export default function OrdersPagination({ page, limit, total, totalPages, onPageChange, visible }) {
  const { t } = useTranslation('adminOrders')

  if (!visible) {
    return null
  }

  const summary = getOrdersSummary({ page, limit, total })
  const pageNumbers = getOrdersPageNumbers({ page, total, limit })

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-[var(--admin-border)] pt-4 sm:flex-row sm:items-start sm:justify-between lg:items-center">
      <div className="text-sm leading-6 text-[var(--admin-text-muted)]">
        {t('pagination.summary', { from: summary.from, to: summary.to, total })}
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm font-medium text-[var(--admin-text-muted)] transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('pagination.previous')}
        </button>

        <div className="flex flex-wrap items-center gap-1 sm:justify-center">
          {pageNumbers.map(pageNumber => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`min-w-9 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                page === pageNumber
                  ? 'border border-transparent bg-[var(--admin-accent)] text-white'
                  : 'border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)] hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]'
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm font-medium text-[var(--admin-text-muted)] transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('pagination.next')}
        </button>
      </div>
    </div>
  )
}
