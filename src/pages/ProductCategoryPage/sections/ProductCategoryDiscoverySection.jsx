import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function ProductCategoryDiscoverySection({ categories, activeSlug }) {
  const { t } = useTranslation('clientProducts')

  const discoveryCategories = categories.filter(category => category.slug !== activeSlug).slice(0, 10)

  if (!discoveryCategories.length) return null

  return (
    <section className="rounded-2xl bg-white p-3 shadow-sm dark:bg-gray-900 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-gray-950 dark:text-white sm:text-lg">{t('categoryPage.discovery.title')}</h2>
      </div>

      <div className="-mx-3 flex gap-3 overflow-x-auto px-3 pb-1 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 xl:grid-cols-6">
        {discoveryCategories.map(category => (
          <Link
            key={category._id || category.slug}
            to={`/product-categories/${category.slug}`}
            className="group flex min-w-[112px] max-w-[112px] flex-col items-center rounded-2xl border border-gray-100 bg-gray-50/80 p-2.5 text-center text-xs font-medium text-gray-900 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-800/70 dark:text-gray-100 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-300 sm:min-w-0 sm:max-w-none sm:text-sm"
          >
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 dark:bg-gray-900 sm:h-16 sm:w-16 lg:h-20 lg:w-20">
              {category.thumbnail ? (
                <img src={category.thumbnail} alt={category.title} className="h-full w-full object-cover" />
              ) : (
                <span className="text-lg font-semibold text-gray-400">{category.title?.charAt(0)}</span>
              )}
            </span>

            <span className="mt-2 line-clamp-2 min-h-[34px] leading-[17px] sm:min-h-[40px] sm:leading-5">{category.title}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ProductCategoryDiscoverySection
