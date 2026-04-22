import { FilterOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import { Search } from 'lucide-react'
import { ADMIN_ORDER_SEARCH_PLACEHOLDER, ADMIN_ORDER_STATUS_OPTIONS } from '../utils'

export default function AdminOrdersFiltersSection({ keyword, status, onKeywordChange, onStatusChange }) {
  return (
    <div className="mb-8 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-12 pr-4 placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            placeholder={ADMIN_ORDER_SEARCH_PLACEHOLDER}
            value={keyword}
            onChange={event => onKeywordChange(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <FilterOutlined className="text-lg text-slate-400" />
          <Select
            value={status}
            onChange={onStatusChange}
            style={{ minWidth: 180 }}
            className="rounded-xl font-sans text-slate-700"
            placeholder="Tất cả trạng thái"
            options={ADMIN_ORDER_STATUS_OPTIONS}
          />
        </div>
      </div>
    </div>
  )
}
