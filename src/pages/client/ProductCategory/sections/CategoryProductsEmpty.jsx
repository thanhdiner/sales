import React from 'react'
import { ShoppingBag } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function CategoryProductsEmpty({ hasSearchInput }) {
  const { t } = useTranslation('clientProducts')

  return (
    <div className="rounded-xl bg-white px-6 py-14 text-center shadow-sm dark:bg-gray-900">
      <ShoppingBag className="mx-auto mb-4 h-14 w-14 text-gray-300 dark:text-gray-700" />
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {hasSearchInput ? t('categoryPage.grid.emptySearchTitle') : t('categoryPage.grid.emptyCategoryTitle')}
      </h3>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-300">
        {hasSearchInput ? t('categoryPage.grid.emptySearchDescription') : t('categoryPage.grid.emptyCategoryDescription')}
      </p>
    </div>
  )
}

export default CategoryProductsEmpty
