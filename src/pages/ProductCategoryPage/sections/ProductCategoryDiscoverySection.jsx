import React from 'react'
import { Link } from 'react-router-dom'

function ProductCategoryDiscoverySection({ categories, activeSlug }) {
  const discoveryCategories = categories
    .filter(category => category.slug !== activeSlug)
    .slice(0, 6)

  if (!discoveryCategories.length) return null

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-950 dark:text-white">Khám phá theo danh mục</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {discoveryCategories.map(category => (
          <Link
            key={category._id || category.slug}
            to={`/product-categories/${category.slug}`}
            className="group flex flex-col items-center gap-2 text-center text-sm font-medium text-gray-950 transition-colors hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-300"
          >
            <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100 transition-transform duration-300 group-hover:-translate-y-1 dark:bg-gray-800">
              {category.thumbnail ? (
                <img src={category.thumbnail} alt={category.title} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xl font-semibold text-gray-400">{category.title?.charAt(0)}</span>
              )}
            </span>
            <span className="line-clamp-2 min-h-[40px] leading-5">{category.title}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ProductCategoryDiscoverySection
