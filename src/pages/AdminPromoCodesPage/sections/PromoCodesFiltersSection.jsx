import { Button, DatePicker, Input, Select } from 'antd'
import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  PROMO_CODE_AUDIENCE_FILTERS,
  PROMO_CODE_DATE_FIELDS,
  PROMO_CODE_DISCOUNT_TYPE_FILTERS,
  PROMO_CODE_STATUS_FILTERS
} from '../utils/promoCodeHelpers'

const { RangePicker } = DatePicker

const inputClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'
const secondaryButtonClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
const selectClass =
  'admin-promo-filter-select h-10 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-[var(--admin-border)] [&_.ant-select-selector]:!bg-[var(--admin-surface-2)] [&_.ant-select-selection-item]:!text-[var(--admin-text)]'

export default function PromoCodesFiltersSection({ filters, onFiltersChange, onClearFilters }) {
  const { t } = useTranslation('adminPromoCodes')

  const updateFilter = (key, value) => onFiltersChange({ ...filters, [key]: value })

  return (
    <section className="admin-promo-filters-section rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
      <div className="grid gap-3 xl:grid-cols-[minmax(240px,1.4fr)_minmax(150px,0.65fr)_minmax(180px,0.8fr)_minmax(190px,0.9fr)]">
        <Input
          allowClear
          size="large"
          value={filters.search}
          onChange={event => updateFilter('search', event.target.value)}
          prefix={<Search className="mr-1 h-4 w-4 text-[var(--admin-text-subtle)]" />}
          placeholder={t('filters.searchPlaceholder')}
          className={inputClass}
        />

        <Select
          value={filters.status}
          onChange={value => updateFilter('status', value)}
          className={selectClass}
          options={PROMO_CODE_STATUS_FILTERS.map(status => ({
            value: status,
            label: t(`filters.statusOptions.${status}`)
          }))}
        />

        <Select
          value={filters.discountType}
          onChange={value => updateFilter('discountType', value)}
          className={selectClass}
          options={PROMO_CODE_DISCOUNT_TYPE_FILTERS.map(type => ({
            value: type,
            label: t(`filters.discountTypeOptions.${type}`)
          }))}
        />

        <Select
          value={filters.audience}
          onChange={value => updateFilter('audience', value)}
          className={selectClass}
          options={PROMO_CODE_AUDIENCE_FILTERS.map(audience => ({
            value: audience,
            label: t(`filters.audienceOptions.${audience}`)
          }))}
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(170px,0.35fr)_minmax(260px,0.9fr)_auto]">
        <Select
          value={filters.dateField}
          onChange={value => updateFilter('dateField', value)}
          className={selectClass}
          options={PROMO_CODE_DATE_FIELDS.map(field => ({
            value: field,
            label: t(`filters.dateFields.${field}`)
          }))}
        />

        <RangePicker
          value={filters.dateRange}
          onChange={value => updateFilter('dateRange', value)}
          className={`${inputClass} admin-promo-date-picker h-10 w-full`}
          popupClassName="admin-promo-date-popup"
        />

        <Button
          icon={<X className="h-4 w-4" />}
          size="large"
          onClick={onClearFilters}
          className={secondaryButtonClass}
        >
          {t('filters.clear')}
        </Button>
      </div>
    </section>
  )
}
