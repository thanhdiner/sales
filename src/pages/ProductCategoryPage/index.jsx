import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import useProductCategoryPage from './hooks/useProductCategoryPage'
import CategoryChildrenSection from './sections/CategoryChildrenSection'
import CategoryContentSection from './sections/CategoryContentSection'
import CategoryHeroSection from './sections/CategoryHeroSection'
import CategoryProductsSection from './sections/CategoryProductsSection'
import ProductCategoryErrorState from './sections/ProductCategoryErrorState'
import ProductCategoryLoadingState from './sections/ProductCategoryLoadingState'
import { getCategoryDescription } from './utils/productCategoryUtils'

function ProductCategoryDetailPage() {
  const { t } = useTranslation('clientProducts')
  const { slug } = useParams()
  const {
    category,
    loading,
    error,
    searchInput,
    sortBy,
    currentPage,
    totalPages,
    limit,
    categoryChildren,
    childCategoryProductCounts,
    paginatedProducts,
    totalProducts,
    resultCount,
    hasSearchInput,
    handleSearchChange,
    clearSearch,
    setSortBy,
    setPage
  } = useProductCategoryPage(slug)

  if (loading) {
    return <ProductCategoryLoadingState />
  }

  if (error || !category) {
    return <ProductCategoryErrorState error={error} />
  }

  const fallbackDescription = t('categoryPage.seo.fallbackDescription', {
    categoryTitle: category.title || ''
  })
  const plainDescription = getCategoryDescription(category, fallbackDescription)
  const shortDescription = plainDescription.slice(0, 180)
  const categoryTitle = category.title || t('categoryPage.seo.fallbackTitle')

  return (
    <div className="min-h-screen bg-[#f5f5fa] px-3 py-4 dark:bg-gray-950 md:px-5 md:py-6">
      <SEO
        title={categoryTitle}
        description={shortDescription || fallbackDescription}
        url={`https://smartmall.site/product-categories/${slug}`}
      />

      <main className="mx-auto flex max-w-[1440px] flex-col gap-4">
        <CategoryHeroSection
          category={category}
          plainDescription={plainDescription}
          totalProducts={totalProducts}
          childCount={categoryChildren.length}
        />

        <CategoryChildrenSection categories={categoryChildren} productCounts={childCategoryProductCounts} />

        <CategoryContentSection category={category} />

        <CategoryProductsSection
          products={paginatedProducts}
          totalProducts={totalProducts}
          resultCount={resultCount}
          currentPage={currentPage}
          totalPages={totalPages}
          limit={limit}
          hasSearchInput={hasSearchInput}
          searchInput={searchInput}
          sortBy={sortBy}
          onSearchChange={handleSearchChange}
          onSortChange={setSortBy}
          onClearSearch={clearSearch}
          onPageChange={setPage}
        />
      </main>
    </div>
  )
}

export default ProductCategoryDetailPage
