import { FilterOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import SearchInput from '@/components/shared/SearchInput'
import { getOrderStatusOptions } from '../utils'

export default function OrdersFilters({ keyword, status, onClearFilters, onKeywordChange, onStatusChange }) {
  const { t } = useTranslation('adminOrders')
  const statusOptions = getOrderStatusOptions(t)

  return (
    <div className="mb-4 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-3 shadow-[var(--admin-shadow)] sm:p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--admin-text)]">
        <FilterOutlined className="text-[var(--admin-accent)]" />
        <span>{t('filters.title')}</span>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto] lg:items-center">
        <SearchInput
          value={keyword}
          onChange={event => onKeywordChange(event.target.value)}
          onClear={() => onKeywordChange('')}
          placeholder={t('filters.searchPlaceholder')}
          className="admin-orders-search-input h-10"
        />

        <Select
          value={status}
          onChange={onStatusChange}
          className="admin-orders-status-select w-full rounded-xl font-sans text-[var(--admin-text)]"
          popupClassName="admin-orders-select-dropdown"
          placeholder={t('filters.statusPlaceholder')}
          options={statusOptions}
        />

        <Button icon={<ReloadOutlined />} onClick={onClearFilters}>
          {t('filters.clear')}
        </Button>
      </div>
    </div>
  )
}
