import React from 'react'

function ProductCategoryTitleSection({ category }) {
  return (
    <section className="rounded-xl bg-white px-5 py-6 shadow-sm dark:bg-gray-900 md:px-6 md:py-8">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-gray-950 dark:text-white md:text-[32px]">
        {category.title}
      </h1>
    </section>
  )
}

export default ProductCategoryTitleSection
