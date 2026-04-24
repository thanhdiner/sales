import React from 'react'
import { useParams } from 'react-router-dom'
import SEO from '@/components/SEO'
import useProductCategoryPage from './hooks/useProductCategoryPage'
import ProductCategoryErrorState from './sections/ProductCategoryErrorState'
import ProductCategoryFiltersSection from './sections/ProductCategoryFiltersSection'
import ProductCategoryDiscoverySection from './sections/ProductCategoryDiscoverySection'
import ProductCategoryGridSection from './sections/ProductCategoryGridSection'
import ProductCategoryLoadingState from './sections/ProductCategoryLoadingState'
import ProductCategoryTitleSection from './sections/ProductCategoryTitleSection'
import { getCategoryDescription } from './utils/productCategoryUtils'

function ProductCategoryPage() {
  const { slug } = useParams()
  const {
    category,
    loading,
    error,
    searchInput,
    sortBy,
    selectedFeatures,
    currentPage,
    totalPages,
    flattenedCategories,
    filteredProducts,
    paginatedProducts,
    handleSearchChange,
    setSortBy,
    setFeatureFilters,
    setPage
  } = useProductCategoryPage(slug)

  if (loading) {
    return <ProductCategoryLoadingState />
  }

  if (error || !category) {
    return <ProductCategoryErrorState error={error} />
  }

  const plainDescription = getCategoryDescription(category)
  const shortDescription = plainDescription.slice(0, 180)
  const hasSearchInput = searchInput.trim().length > 0

  return (
    <div className="min-h-screen bg-[#f5f5fa] px-3 py-4 dark:bg-gray-950 md:px-5">
      <SEO
        title={category.title || 'Danh mục sản phẩm'}
        description={shortDescription || `Xem tất cả sản phẩm trong danh mục ${category.title || ''} tại SmartMall.`}
        url={`https://smartmall.site/categories/${slug}`}
      />

      <div className="mx-auto max-w-[1440px]">
        <main className="min-w-0 space-y-4">
          <ProductCategoryTitleSection category={category} />

          <ProductCategoryDiscoverySection categories={flattenedCategories} activeSlug={slug} />

          <ProductCategoryFiltersSection
            searchInput={searchInput}
            sortBy={sortBy}
            selectedFeatures={selectedFeatures}
            onSearchChange={handleSearchChange}
            onSortChange={setSortBy}
            onFeatureFiltersChange={setFeatureFilters}
          />

          <ProductCategoryGridSection
            products={paginatedProducts}
            totalProducts={filteredProducts.length}
            currentPage={currentPage}
            totalPages={totalPages}
            hasSearchInput={hasSearchInput}
            onPageChange={setPage}
          />
        </main>
      </div>
    </div>
  )
}

export default ProductCategoryPage
