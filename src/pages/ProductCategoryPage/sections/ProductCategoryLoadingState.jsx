import React from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'

function ProductCategoryLoadingState() {
  const { t } = useTranslation('clientProducts')

  return (
    <div className="min-h-screen bg-[#f5f5fa] px-3 py-4 dark:bg-gray-950 md:px-5 md:py-6">
      <SEO title={t('categoryPage.errorState.seoTitle')} />

      <main className="mx-auto flex max-w-[1440px] animate-pulse flex-col gap-4">
        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800 md:px-6">
            <div className="h-5 w-80 max-w-full rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="grid gap-6 p-4 md:p-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
            <div className="flex flex-col justify-center">
              <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-4 h-11 w-[460px] max-w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="mt-4 h-4 w-full max-w-2xl rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-3 h-4 w-3/4 max-w-xl rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-5 flex flex-wrap gap-2.5">
                <div className="h-8 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-8 w-36 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="mt-6 flex gap-3">
                <div className="h-11 w-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="h-11 w-28 rounded-lg bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>

            <div className="min-h-[220px] rounded-xl bg-gray-100 dark:bg-gray-800 md:min-h-[280px]" />
          </div>
        </section>

        <section className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900 md:p-5">
          <div className="mb-4 h-6 w-40 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="-mx-4 flex gap-3 overflow-hidden px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="min-w-[150px] rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/50 sm:min-w-0">
                <div className="h-14 w-14 rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="mt-3 h-4 w-28 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mt-2 h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900 md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="h-6 w-52 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-2 h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700 sm:w-[280px]" />
              <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700 sm:w-[210px]" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="mt-1 flex h-full flex-col rounded-[16px] bg-white p-3 shadow-sm dark:bg-gray-900">
              <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="mt-3 h-5 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-2 h-5 w-4/5 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-3 h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-3 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default ProductCategoryLoadingState
