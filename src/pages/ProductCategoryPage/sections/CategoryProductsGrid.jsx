import React from 'react'
import ProductItem from '@/components/Products/ProductItem'

function CategoryProductsGrid({ products = [] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {products.map((product, index) => (
        <ProductItem key={product._id || product.id || product.slug || `category-product-${index}`} product={product} />
      ))}
    </div>
  )
}

export default CategoryProductsGrid
