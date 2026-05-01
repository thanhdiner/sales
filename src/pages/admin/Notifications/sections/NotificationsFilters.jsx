import { Button, DatePicker, Input, Select } from 'antd'
import { Archive, CheckCheck, Search, Trash2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  adminNotificationPriorityLevels,
  adminNotificationStatusFilters,
  adminNotificationTabFilters,
  adminNotificationTypes
} from '../data'

const { RangePicker } = DatePicker

const inputClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'
const secondaryButtonClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
const dangerButtonClass =
  'rounded-lg !border-red-200 !bg-red-50 !text-red-600 hover:!border-red-300 hover:!bg-red-100 dark:!border-red-900/50 dark:!bg-red-950/30 dark:!text-red-300'

export default function NotificationsFilters({
  filters,
  selectedCount,
  onFiltersChange,
  onClearFilters,
  onClearSelection,
  onMarkSelectedRead,
  onArchiveSelected,
  onDeleteSelected
}) {
  const { t } = useTranslation('adminNotifications')

  const updateFilter = (key, value) => onFiltersChange({ ...filters, [key]: value })

  return (
    <section className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
      <div className="flex flex-wrap gap-2">
        {adminNotificationTabFilters.map(tabKey => {
          const active = filters.tab === tabKey

          return (
            <button
              key={tabKey}
              type="button"
              onClick={() => updateFilter('tab', tabKey)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'border-[var(--admin-accent)] bg-[var(--admin-accent)] text-white'
                  : 'border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] hover:border-[var(--admin-border-strong)] hover:text-[var(--admin-text)]'
              }`}
            >
              {t(`tabs.${tabKey}`)}
            </button>
          )
        })}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(220px,1.4fr)_minmax(160px,0.8fr)_minmax(150px,0.7fr)_minmax(150px,0.7fr)_minmax(230px,1fr)_auto]">
        <Input
          allowClear
          prefix={<Search className="mr-1 h-4 w-4 text-[var(--admin-text-subtle)]" />}
          value={filters.search}
          onChange={event => updateFilter('search', event.target.value)}
          placeholder={t('filters.searchPlaceholder')}
          className={inputClass}
          size="large"
        />

        <Select
          value={filters.type}
          onChange={value => updateFilter('type', value)}
          className="h-10 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-[var(--admin-border)] [&_.ant-select-selector]:!bg-[var(--admin-surface-2)] [&_.ant-select-selection-item]:!text-[var(--admin-text)]"
          options={[
            { value: 'all', label: t('filters.allTypes') },
            ...adminNotificationTypes.map(type => ({ value: type, label: t(`types.${type}`) }))
          ]}
        />

        <Select
          value={filters.priority}
          onChange={value => updateFilter('priority', value)}
          className="h-10 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-[var(--admin-border)] [&_.ant-select-selector]:!bg-[var(--admin-surface-2)] [&_.ant-select-selection-item]:!text-[var(--admin-text)]"
          options={[
            { value: 'all', label: t('filters.allPriorities') },
            ...adminNotificationPriorityLevels.map(priority => ({ value: priority, label: t(`priorities.${priority}`) }))
          ]}
        />

        <Select
          value={filters.status}
          onChange={value => updateFilter('status', value)}
          className="h-10 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-[var(--admin-border)] [&_.ant-select-selector]:!bg-[var(--admin-surface-2)] [&_.ant-select-selection-item]:!text-[var(--admin-text)]"
          options={adminNotificationStatusFilters.map(status => ({ value: status, label: t(`statuses.${status}`) }))}
        />

        <RangePicker
          value={filters.dateRange}
          onChange={value => updateFilter('dateRange', value)}
          className={`${inputClass} h-10`}
        />

        <Button icon={<X className="h-4 w-4" />} size="large" onClick={onClearFilters} className={secondaryButtonClass}>
          {t('filters.clear')}
        </Button>
      </div>

      {selectedCount > 0 && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-[var(--admin-text-muted)]">
            {t('selection.selected', { count: selectedCount })}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button icon={<CheckCheck className="h-4 w-4" />} onClick={onMarkSelectedRead} className={secondaryButtonClass}>
              {t('selection.markRead')}
            </Button>
            <Button icon={<Archive className="h-4 w-4" />} onClick={onArchiveSelected} className={secondaryButtonClass}>
              {t('selection.archive')}
            </Button>
            <Button icon={<Trash2 className="h-4 w-4" />} onClick={onDeleteSelected} className={dangerButtonClass}>
              {t('selection.delete')}
            </Button>
            <Button icon={<X className="h-4 w-4" />} onClick={onClearSelection} className={secondaryButtonClass}>
              {t('selection.clear')}
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
