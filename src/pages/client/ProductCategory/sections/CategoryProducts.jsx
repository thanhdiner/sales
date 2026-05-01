import React from 'react'
import CategoryProductsEmpty from './CategoryProductsEmpty'
import CategoryProductsGrid from './CategoryProductsGrid'
import CategoryProductsPagination from './CategoryProductsPagination'
import CategoryProductsToolbar from './CategoryProductsToolbar'

function CategoryProducts({
  products,
  totalProducts,
  resultCount,
  currentPage,
  totalPages,
  limit,
  hasSearchInput,
  searchInput,
  sortBy,
  onSearchChange,
  onSortChange,
  onClearSearch,
  onPageChange
}) {
  return (
    <section id="category-products" className="scroll-mt-24 space-y-4">
      <CategoryProductsToolbar
        totalProducts={totalProducts}
        resultCount={resultCount}
        searchInput={searchInput}
        sortBy={sortBy}
        onSearchChange={onSearchChange}
        onSortChange={onSortChange}
        onClearSearch={onClearSearch}
      />

      {products.length > 0 ? (
        <>
          <CategoryProductsGrid products={products} />
          <CategoryProductsPagination
            currentPage={currentPage}
            totalProducts={resultCount}
            totalPages={totalPages}
            pageSize={limit}
            onPageChange={onPageChange}
          />
        </>
      ) : (
        <CategoryProductsEmpty hasSearchInput={hasSearchInput} />
      )}
    </section>
  )
}

export default CategoryProducts
