import React from 'react'
import { Select } from 'antd'
import { Search, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const { Option } = Select

const QUICK_FILTERS = [
  { labelKey: 'categoryPage.filters.quickFilters.autoDelivery', value: 'auto-delivery' },
  { labelKey: 'categoryPage.filters.quickFilters.licensed', value: 'licensed' },
  { labelKey: 'categoryPage.filters.quickFilters.support', value: 'support' },
  { labelKey: 'categoryPage.filters.quickFilters.featured', value: 'featured' }
]

function ProductCategoryFilters({ searchInput, sortBy, selectedFeatures, onSearchChange, onSortChange, onFeatureFiltersChange }) {
  const { t } = useTranslation('clientProducts')

  const getFilterLabel = value => {
    const filter = QUICK_FILTERS.find(item => item.value === value)
    return filter ? t(filter.labelKey) : value
  }

  const toggleFilter = value => {
    const nextFeatures = selectedFeatures.includes(value) ? selectedFeatures.filter(item => item !== value) : [...selectedFeatures, value]

    onFeatureFiltersChange(nextFeatures)
  }

  const resetFilters = () => {
    onFeatureFiltersChange([])
    onSortChange('name')
  }

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
      <div>
        <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{t('categoryPage.filters.title')}</h2>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('categoryPage.filters.description')}</p>
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="group flex h-10 flex-1 items-center gap-2 rounded-full border border-gray-200 bg-white px-3 transition-colors focus-within:border-blue-500 dark:border-gray-700 dark:bg-gray-950">
          <Search className="h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />

          <input
            type="text"
            placeholder={t('categoryPage.filters.searchPlaceholder')}
            value={searchInput}
            onChange={onSearchChange}
            className="h-full w-full border-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
          />
        </label>

        <Select value={sortBy} onChange={onSortChange} className="w-full lg:w-[150px]" size="middle">
          <Option value="name">{t('categoryPage.filters.sort.name')}</Option>
          <Option value="price-low">{t('categoryPage.filters.sort.priceLow')}</Option>
          <Option value="price-high">{t('categoryPage.filters.sort.priceHigh')}</Option>
        </Select>

        <button
          type="button"
          onClick={resetFilters}
          className="h-10 rounded-md border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-300"
        >
          {t('categoryPage.filters.reset')}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
        {QUICK_FILTERS.map(filter => {
          const isSelected = selectedFeatures.includes(filter.value)
          const label = t(filter.labelKey)

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => toggleFilter(filter.value)}
              className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-300'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-300'
              }`}
            >
              {filter.value === 'featured' ? (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {label}
                </span>
              ) : (
                label
              )}
            </button>
          )
        })}
      </div>

      {selectedFeatures.length > 0 ? (
        <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-gray-500 dark:text-gray-400">
            <span>{t('categoryPage.filters.activeLabel')}</span>

            {selectedFeatures.map(value => (
              <span
                key={value}
                className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                {getFilterLabel(value)}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="self-start text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200 sm:self-auto"
          >
            {t('categoryPage.filters.clear')}
          </button>
        </div>
      ) : null}
    </section>
  )
}

export default ProductCategoryFilters
