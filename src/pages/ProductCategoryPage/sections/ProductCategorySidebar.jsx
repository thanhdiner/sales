import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'

function ProductCategorySidebar({ categories, activeSlug }) {
  const visibleCategories = categories.slice(0, 7)

  return (
    <aside className="hidden lg:block lg:w-[260px] xl:w-[280px]">
      <div className="sticky top-4 overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-900">
        <h2 className="border-b border-gray-100 px-4 py-4 text-base font-semibold text-gray-950 dark:border-gray-800 dark:text-white">
          Khám phá theo danh mục
        </h2>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {visibleCategories.map((category, index) => {
            const isActive = category.slug === activeSlug || category.children?.some(child => child.slug === activeSlug)
            const children = category.children?.slice(0, 12) || []

            return (
              <div key={category._id || category.slug} className="bg-white dark:bg-gray-900">
                <Link
                  to={`/product-categories/${category.slug}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-gray-950 transition-colors hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-300"
                >
                  <span>{category.title}</span>
                  {children.length > 0 ? (
                    isActive || index === 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  ) : null}
                </Link>

                {(isActive || index === 0) && children.length > 0 ? (
                  <div className="space-y-2 px-7 pb-3 text-sm text-gray-700 dark:text-gray-300">
                    {children.map(child => (
                      <Link
                        key={child._id || child.slug}
                        to={`/product-categories/${child.slug}`}
                        className={`block leading-6 transition-colors hover:text-blue-600 dark:hover:text-blue-300 ${
                          child.slug === activeSlug ? 'font-semibold text-blue-600 dark:text-blue-300' : ''
                        }`}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

export default ProductCategorySidebar
