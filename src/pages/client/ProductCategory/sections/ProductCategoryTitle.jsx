import React from 'react'
import { ContentSection } from '@/components/client/PageLayout'

function ProductCategoryTitle({ category }) {
  return (
    <ContentSection>
      <h1 className="text-2xl font-semibold text-gray-950 dark:text-white md:text-[32px]">
        {category.title}
      </h1>
    </ContentSection>
  )
}

export default ProductCategoryTitle
