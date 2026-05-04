import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ContentSection } from '@/components/client/PageLayout'
import SearchInput from '@/components/shared/SearchInput'
import SimpleSelect from '@/components/shared/SimpleSelect'

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
    <ContentSection as="div" className="category-products-toolbar">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{t('categoryPage.products.title')}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('categoryPage.products.filteredCount', { count: resultCount })}
            {resultCount !== totalProducts ? ` / ${t('categoryPage.products.count', { count: totalProducts })}` : ''}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={searchInput}
            onChange={onSearchChange}
            onClear={onClearSearch}
            placeholder={t('categoryPage.products.searchPlaceholder')}
            className="sm:w-[280px]"
          />

          <SimpleSelect
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions}
            className="w-full sm:w-[210px]"
          />
        </div>
      </div>
    </ContentSection>
  )
}

export default CategoryProductsToolbar
