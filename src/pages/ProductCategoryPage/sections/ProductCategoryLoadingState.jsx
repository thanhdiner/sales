import React from 'react'
import SEO from '@/components/SEO'

function ProductCategoryLoadingState() {
  return (
    <div className="min-h-screen bg-[#f6f8fc] px-4 py-8 dark:bg-gray-950 md:py-10">
      <SEO title="Danh mục sản phẩm" />

      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/80 md:p-8">
          <div className="mb-4 h-4 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="mb-4 h-10 w-72 rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2 h-4 w-full max-w-3xl rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-full max-w-2xl rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/80 md:p-8">
            <div className="mb-4 h-5 w-40 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-full max-w-xl rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-3 h-5 w-full max-w-lg rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-6 flex gap-3">
              <div className="h-10 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-10 w-36 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/80 md:p-8">
            <div className="mx-auto aspect-square max-w-[320px] rounded-[32px] bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>

        <div className="rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/80 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="h-12 flex-1 rounded-2xl bg-gray-200 dark:bg-gray-700" />
            <div className="h-12 w-full rounded-2xl bg-gray-200 dark:bg-gray-700 md:w-[220px]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/70 bg-white/90 p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900/80"
            >
              <div className="mb-3 aspect-square rounded-2xl bg-gray-200 dark:bg-gray-700" />
              <div className="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mb-3 h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductCategoryLoadingState
