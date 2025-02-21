import React from 'react'
import './ProductList.scss'
import ProductCard from './ProductCard'

function ProductList(props) {
  const { products } = props
  return (
    <>
      <div className="products">
        {products?.map(product => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </>
  )
}

export default ProductList
