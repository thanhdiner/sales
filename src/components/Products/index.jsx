import React, { useEffect, useState } from 'react'
import { getProducts } from '../../services/productService'
import ProductList from './ProductList'

function Products() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getProducts()
      setProducts(result)
    }
    fetchApi()
  }, [])

  return (
    <>
      <h1>Trang danh sách sản phẩm</h1>
      <ProductList products={products} />
    </>
  )
}

export default Products
