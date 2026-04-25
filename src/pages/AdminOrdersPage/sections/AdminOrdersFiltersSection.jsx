import { FilterOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import { Search } from 'lucide-react'
import { ADMIN_ORDER_SEARCH_PLACEHOLDER, ADMIN_ORDER_STATUS_OPTIONS } from '../utils'

export default function AdminOrdersFiltersSection({ keyword, status, onKeywordChange, onStatusChange }) {
  return (
    <div className="mb-8 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-6 shadow-[var(--admin-shadow)]">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--admin-text-subtle)]" />
          <input
            className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] py-3 pl-12 pr-4 text-[var(--admin-text)] placeholder-[var(--admin-text-subtle)] transition-all duration-200 focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--admin-accent)_18%,transparent)]"
            placeholder={ADMIN_ORDER_SEARCH_PLACEHOLDER}
            value={keyword}
            onChange={event => onKeywordChange(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <FilterOutlined className="text-lg text-[var(--admin-text-subtle)]" />
          <Select
            value={status}
            onChange={onStatusChange}
            style={{ minWidth: 180 }}
            className="admin-orders-status-select rounded-xl font-sans text-[var(--admin-text)]"
            placeholder="Tất cả trạng thái"
            options={ADMIN_ORDER_STATUS_OPTIONS}
          />
        </div>
      </div>
    </div>
  )
}
