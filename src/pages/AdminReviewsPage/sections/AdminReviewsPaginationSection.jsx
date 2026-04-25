import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function AdminReviewsPaginationSection({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null
  }

  const pageNumbers = Array.from({ length: Math.min(totalPages, 7) }, (_, index) => index + 1)

  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-2 text-[var(--admin-text-muted)] transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} strokeWidth={1.8} />
      </button>

      {pageNumbers.map(pageNumber => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          className={`h-9 w-9 rounded-xl border text-sm font-medium transition-colors ${
            pageNumber === page
              ? 'border-[var(--admin-accent)] bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]'
              : 'border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)] hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]'
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-2 text-[var(--admin-text-muted)] transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={16} strokeWidth={1.8} />
      </button>
    </div>
  )
}
