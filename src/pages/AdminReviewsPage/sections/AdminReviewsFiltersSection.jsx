import { Search } from 'lucide-react'

export default function AdminReviewsFiltersSection({ search, total, onSearchChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          strokeWidth={1.8}
        />

        <input
          type="text"
          placeholder="Tìm theo tên khách hàng, nội dung..."
          value={search}
          onChange={event => onSearchChange(event.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-700 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-gray-500"
        />
      </div>

      <span className="text-sm text-gray-500 dark:text-gray-400">{total} kết quả</span>
    </div>
  )
}
