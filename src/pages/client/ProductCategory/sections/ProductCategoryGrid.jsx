import React from 'react'
import { Pagination } from 'antd'
import { useTranslation } from 'react-i18next'
import ProductItem from '@/components/client/Products/ProductItem'

function ProductCategoryGrid({ products, totalProducts, currentPage, totalPages, hasSearchInput, onPageChange }) {
  const { t } = useTranslation('clientProducts')

  if (products.length === 0) {
    return (
      <section className="rounded-xl bg-white px-6 py-14 text-center shadow-sm dark:bg-gray-900">
        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
          {hasSearchInput ? t('categoryPage.grid.emptySearchTitle') : t('categoryPage.grid.emptyCategoryTitle')}
        </h3>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-300">
          {hasSearchInput ? t('categoryPage.grid.emptySearchDescription') : t('categoryPage.grid.emptyCategoryDescription')}
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {products.map(product => (
          <ProductItem key={product._id} product={product} viewMode="grid" />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="flex flex-col gap-3 rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('categoryPage.grid.showing', {
              shown: products.length,
              total: totalProducts
            })}
          </p>

          <Pagination current={currentPage} total={totalProducts} pageSize={20} showSizeChanger={false} onChange={onPageChange} />
        </div>
      ) : null}
    </section>
  )
}

export default ProductCategoryGrid
