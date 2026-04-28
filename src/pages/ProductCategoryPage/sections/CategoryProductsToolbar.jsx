import React, { useMemo } from 'react'
import { Select } from 'antd'
import { Search, SortDesc, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const SORT_OPTIONS = [
  { value: 'recommended', labelKey: 'categoryPage.products.sort.recommended' },
  { value: 'newest', labelKey: 'categoryPage.products.sort.newest' },
  { value: 'sold_desc', labelKey: 'categoryPage.products.sort.soldDesc' },
  { value: 'rate_desc', labelKey: 'categoryPage.products.sort.rateDesc' },
  { value: 'price_asc', labelKey: 'categoryPage.products.sort.priceAsc' },
  { value: 'price_desc', labelKey: 'categoryPage.products.sort.priceDesc' },
  { value: 'name_asc', labelKey: 'categoryPage.products.sort.nameAsc' },
  { value: 'name_desc', labelKey: 'categoryPage.products.sort.nameDesc' }
]

function CategoryProductsToolbar({
  totalProducts,
  resultCount,
  searchInput,
  sortBy,
  onSearchChange,
  onSortChange,
  onClearSearch
}) {
  const { t } = useTranslation('clientProducts')
  const sortOptions = useMemo(
    () => SORT_OPTIONS.map(option => ({ value: option.value, label: t(option.labelKey) })),
    [t]
  )

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900 md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{t('categoryPage.products.title')}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('categoryPage.products.filteredCount', { count: resultCount })}
            {resultCount !== totalProducts ? ` / ${t('categoryPage.products.count', { count: totalProducts })}` : ''}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="group relative flex h-10 min-w-0 items-center rounded-lg border border-gray-200 bg-white pl-9 pr-9 transition-colors focus-within:border-blue-500 dark:border-gray-700 dark:bg-gray-950 sm:w-[280px]">
            <Search className="absolute left-3 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder={t('categoryPage.products.searchPlaceholder')}
              value={searchInput}
              onChange={onSearchChange}
              className="h-full w-full border-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={onClearSearch}
                className="absolute right-3 text-gray-400 transition-colors hover:text-gray-700 dark:hover:text-gray-200"
                aria-label={t('categoryPage.products.clearSearch')}
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>

          <Select
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions}
            suffixIcon={<SortDesc size={16} />}
            className="w-full sm:w-[210px]"
            size="middle"
            aria-label={t('categoryPage.products.sortLabel')}
          />
        </div>
      </div>
    </div>
  )
}

export default CategoryProductsToolbar
