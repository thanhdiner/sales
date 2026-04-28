import { FilterOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getAdminOrderStatusOptions } from '../utils'

export default function AdminOrdersFiltersSection({ keyword, status, onKeywordChange, onStatusChange }) {
  const { t } = useTranslation('adminOrders')
  const statusOptions = getAdminOrderStatusOptions(t)

  return (
    <div className="mb-5 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-3 shadow-[var(--admin-shadow)] sm:mb-6 sm:p-4 lg:mb-8 lg:rounded-2xl lg:p-6">
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--admin-text-subtle)]" />
          <input
            className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] py-2.5 pl-11 pr-4 text-sm text-[var(--admin-text)] placeholder-[var(--admin-text-subtle)] transition-all duration-200 focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--admin-accent)_18%,transparent)] sm:py-3 sm:pl-12 sm:text-base"
            placeholder={t('filters.searchPlaceholder')}
            value={keyword}
            onChange={event => onKeywordChange(event.target.value)}
          />
        </div>

        <div className="flex w-full items-center gap-2 lg:w-auto">
          <FilterOutlined className="text-lg text-[var(--admin-text-subtle)]" />
          <Select
            value={status}
            onChange={onStatusChange}
            style={{ width: '100%' }}
            className="admin-orders-status-select w-full rounded-xl font-sans text-[var(--admin-text)] lg:min-w-[180px]"
            placeholder={t('filters.statusPlaceholder')}
            options={statusOptions}
          />
        </div>
      </div>
    </div>
  )
}
