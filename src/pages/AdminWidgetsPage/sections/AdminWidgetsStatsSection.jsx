import { getWidgetStats } from '../utils'

export default function AdminWidgetsStatsSection({ widgets }) {
  const stats = getWidgetStats(widgets)

  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-3">
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Tổng</p>
        <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Hoạt động</p>
        <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{stats.active}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Tạm dừng</p>
        <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{stats.inactive}</p>
      </div>
    </div>
  )
}
