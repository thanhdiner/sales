import React from 'react'
import SEO from '@/components/SEO'

function ProductCategoryLoadingState() {
  return (
    <div className="min-h-screen bg-[#f5f5fa] px-3 py-4 dark:bg-gray-950 md:px-5">
      <SEO title="Danh mục sản phẩm" />

      <div className="mx-auto max-w-[1440px]">
        <main className="min-w-0 animate-pulse space-y-4">
          <section className="rounded-xl bg-white px-5 py-6 shadow-sm dark:bg-gray-900 md:px-6 md:py-8">
            <div className="h-11 w-[420px] max-w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
          </section>

          <section className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
            <div className="mb-4 h-8 w-72 rounded-lg bg-gray-200 dark:bg-gray-700" />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="h-20 w-20 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                  <div className="mt-3 h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mt-2 h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
            <div className="h-8 w-52 rounded-lg bg-gray-200 dark:bg-gray-700" />
            <div className="mt-4 h-4 w-full max-w-[640px] rounded bg-gray-200 dark:bg-gray-700" />

            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="h-10 flex-1 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700 lg:w-[150px]" />
              <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700 lg:w-[92px]" />
            </div>

            <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-9 w-44 rounded-full bg-gray-200 dark:bg-gray-700" />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="mt-1 flex h-full flex-col">
                  <div className="relative flex flex-1 flex-col overflow-hidden rounded-[16px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.92)_100%)] shadow-[0_16px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[linear-gradient(180deg,#101213_0%,#151719_100%)]">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-50/80 to-transparent opacity-80 dark:from-green-500/10" />

                    <div className="relative aspect-square overflow-hidden rounded-b-[16px] p-3">
                      <div className="h-full w-full rounded-[12px] border border-white/80 bg-gray-200/80 dark:border-transparent dark:bg-[#202327]" />
                    </div>

                    <div className="space-y-3 px-4 pb-4 pt-3">
                      <div className="h-5 w-full rounded bg-gray-200 dark:bg-[#202327]" />
                      <div className="h-5 w-4/5 rounded bg-gray-200 dark:bg-[#202327]" />
                      <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-[#202327]" />
                      <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-[#202327]" />
                      <div className="h-6 w-1/2 rounded bg-gray-200 dark:bg-[#202327]" />
                    </div>

                    <div className="px-4 pb-4 pt-0">
                      <div className="h-[46px] w-full rounded-[12px] bg-gray-200 dark:bg-green-500/25" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default ProductCategoryLoadingState
