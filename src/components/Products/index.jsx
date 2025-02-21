import React, { useEffect, useState } from 'react'
import { getProducts } from '../../services/productService'
import ProductList from './ProductList'

function Products() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fectApi = async () => {
      const result = await getProducts()
      setProducts(result)
    }
    fectApi()
  }, [])

  return (
    <>
      <h1>Trang danh sách sản phẩm</h1>
      <ProductList products={products} />
    </>
  )
}

export default Products
