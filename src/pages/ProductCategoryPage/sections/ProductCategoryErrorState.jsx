import React from 'react'
import SEO from '@/components/SEO'

function ProductCategoryErrorState({ error }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc] px-4 py-12 dark:bg-gray-950">
      <SEO title="Danh mục sản phẩm" />

      <div className="w-full max-w-lg rounded-[28px] border border-white/70 bg-white/95 p-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.06)] dark:border-gray-800 dark:bg-gray-900/90">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-blue-500 dark:text-blue-300">
          Danh mục sản phẩm
        </p>

        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
          Không thể tải trang danh mục
        </h2>

        <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-300">
          {error || 'Không tìm thấy danh mục này hoặc đã có lỗi xảy ra trong quá trình tải dữ liệu.'}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          Thử tải lại
        </button>
      </div>
    </div>
  )
}

export default ProductCategoryErrorState
