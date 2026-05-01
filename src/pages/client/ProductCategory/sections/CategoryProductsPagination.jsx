import React from 'react'
import { Pagination } from 'antd'
import { useTranslation } from 'react-i18next'

function CategoryProductsPagination({ currentPage, totalProducts, totalPages, pageSize, onPageChange }) {
  const { t } = useTranslation('clientProducts')
  const shown = Math.min(totalProducts, currentPage * pageSize)

  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t('categoryPage.products.showing', {
          shown,
          total: totalProducts
        })}
      </p>

      <Pagination current={currentPage} total={totalProducts} pageSize={pageSize} showSizeChanger={false} onChange={onPageChange} />
    </div>
  )
}

export default CategoryProductsPagination
