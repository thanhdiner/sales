import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowDown, ChevronRight, FolderTree, PackageCheck } from 'lucide-react'

function CategoryHero({ category, plainDescription, totalProducts, childCount }) {
  const { t } = useTranslation('clientProducts')
  const title = category?.title || t('categoryPage.seo.fallbackTitle')

  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800 md:px-6">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
          <Link to="/" className="transition-colors hover:text-blue-600 dark:hover:text-blue-300">
            {t('categoryPage.breadcrumb.home')}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>{t('categoryPage.breadcrumb.categories')}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900 dark:text-gray-100">{title}</span>
        </nav>
      </div>

      <div className="grid gap-6 p-4 md:p-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)] lg:items-stretch">
        <div className="flex min-w-0 flex-col justify-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
            {t('categoryPage.hero.eyebrow')}
          </p>

          <h1 className="max-w-3xl text-3xl font-semibold text-gray-950 dark:text-white md:text-[40px] md:leading-[1.12]">
            {title}
          </h1>

          {plainDescription ? (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-300 md:text-[15px]">
              {plainDescription}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2.5 text-sm text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 font-medium dark:bg-gray-800">
              <PackageCheck className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              {t('categoryPage.hero.productsCount', { count: totalProducts })}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 font-medium dark:bg-gray-800">
              <FolderTree className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              {t('categoryPage.hero.childCategoriesCount', { count: childCount })}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#category-products"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:border dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-100 dark:hover:bg-emerald-500/25"
            >
              {t('categoryPage.hero.viewProducts')}
              <ArrowDown className="h-4 w-4" />
            </a>

            {childCount > 0 ? (
              <a
                href="#category-children"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-800 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-300"
              >
                {t('categoryPage.hero.viewChildren')}
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex min-h-[220px] items-center justify-center rounded-xl bg-gray-50 p-5 dark:bg-gray-950/50 md:min-h-[280px]">
          {category?.thumbnail ? (
            <img
              src={category.thumbnail}
              alt={t('categoryPage.hero.imageAlt', { categoryTitle: title })}
              className="h-full max-h-[240px] w-full rounded-2xl object-contain md:max-h-[280px]"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-5xl font-semibold text-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600">
              {title.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CategoryHero
