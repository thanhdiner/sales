import { Search } from 'lucide-react'

export default function AdminReviewsFiltersSection({ search, total, onSearchChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--admin-text-subtle)]"
          strokeWidth={1.8}
        />

        <input
          type="text"
          placeholder="Tìm theo tên khách hàng, nội dung..."
          value={search}
          onChange={event => onSearchChange(event.target.value)}
          className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] py-2.5 pl-9 pr-4 text-sm text-[var(--admin-text)] shadow-sm outline-none transition-colors placeholder:text-[var(--admin-text-subtle)] focus:border-[var(--admin-accent)]"
        />
      </div>

      <span className="text-sm text-[var(--admin-text-muted)]">{total} kết quả</span>
    </div>
  )
}
