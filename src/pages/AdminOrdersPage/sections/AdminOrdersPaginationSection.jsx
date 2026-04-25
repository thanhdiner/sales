import { getAdminOrdersPageNumbers, getAdminOrdersSummary } from '../utils'

export default function AdminOrdersPaginationSection({ page, limit, total, totalPages, onPageChange, visible }) {
  if (!visible) {
    return null
  }

  const summary = getAdminOrdersSummary({ page, limit, total })
  const pageNumbers = getAdminOrdersPageNumbers({ page, total, limit })

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-[var(--admin-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-[var(--admin-text-muted)]">
        Hiển thị <span className="font-medium text-[var(--admin-text)]">{summary.from}</span> -{' '}
        <span className="font-medium text-[var(--admin-text)]">{summary.to}</span> của{' '}
        <span className="font-medium text-[var(--admin-text)]">{total}</span> đơn hàng
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm font-medium text-[var(--admin-text-muted)] transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Trước
        </button>

        <div className="flex flex-wrap items-center gap-1">
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
          Sau
        </button>
      </div>
    </div>
  )
}
