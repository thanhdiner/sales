import React from 'react'
import { Pagination } from 'antd'
import ProductItem from '@/components/Products/ProductItem'

function ProductCategoryGridSection({ products, totalProducts, currentPage, totalPages, hasSearchInput, onPageChange }) {
  if (products.length === 0) {
    return (
      <section className="rounded-xl bg-white px-6 py-14 text-center shadow-sm dark:bg-gray-900">
        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
          {hasSearchInput ? 'Không tìm thấy sản phẩm phù hợp' : 'Danh mục này chưa có sản phẩm'}
        </h3>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-300">
          {hasSearchInput
            ? 'Hãy thử từ khóa ngắn hơn, không dấu, hoặc đổi cách diễn đạt để hệ thống gợi đúng hơn.'
            : 'Sản phẩm trong danh mục này sẽ xuất hiện tại đây ngay khi được cập nhật trên hệ thống.'}
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
            Hiển thị {products.length} / {totalProducts} sản phẩm
          </p>
          <Pagination
            current={currentPage}
            total={totalProducts}
            pageSize={20}
            showSizeChanger={false}
            onChange={onPageChange}
          />
        </div>
      ) : null}
    </section>
  )
}

export default ProductCategoryGridSection
