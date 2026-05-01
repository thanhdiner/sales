import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ContentSection } from '@/components/client/PageLayout'
import { getCategoryId } from '../utils/productCategoryUtils'

function CategoryChildren({ categories = [], productCounts = {} }) {
  const { t } = useTranslation('clientProducts')

  if (!categories.length) return null

  return (
    <ContentSection id="category-children" className="scroll-mt-24" title={t('categoryPage.children.title')}>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 xl:grid-cols-5">
        {categories.map(category => {
          const categoryId = getCategoryId(category)
          const productCount = productCounts[categoryId] || 0

          return (
            <Link
              key={categoryId || category.slug}
              to={`/product-categories/${category.slug}`}
              className="group flex min-w-[150px] flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 transition hover:border-blue-200 hover:bg-blue-50 dark:border-gray-800 dark:bg-gray-950/50 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 sm:min-w-0"
            >
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-900">
                {category.thumbnail ? (
                  <img src={category.thumbnail} alt={category.title} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <span className="text-lg font-semibold text-gray-400">{category.title?.charAt(0)}</span>
                )}
              </span>

              <span>
                <span className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300">
                  {category.title}
                </span>
                <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                  {t('categoryPage.children.productCount', { count: productCount })}
                </span>
              </span>
            </Link>
          )
        })}
      </div>
    </ContentSection>
  )
}

export default CategoryChildren
