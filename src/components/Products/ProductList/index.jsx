import React from 'react'
import ProductCard from './ProductCard'
import './ProductList.scss'

function ProductList({ products = [], loading = false, className = '' }) {
  if (loading) {
    return (
      <div className={`w-full flex justify-center items-center py-12 ${className}`}>
        <div className="text-gray-500">Loading products...</div>
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className={`w-full flex justify-center items-center py-12 ${className}`}>
        <div className="text-gray-500">No products found</div>
      </div>
    )
  }

  return (
    <div className={`w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
      {products.map((product, index) => (
        <div key={product._id || product.id || `product-${index}`}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

export default ProductList
