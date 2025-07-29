import React, { useEffect, useState, useMemo } from 'react'
import { getProducts } from '../../services/productService'
import ProductList from './ProductList'
import { ShoppingBag, Search, SortDesc } from 'lucide-react'
import { Input, Select, Spin } from 'antd'
import { useSearchParams } from 'react-router-dom'
import debounce from 'lodash.debounce'
import { removeVietnameseTones } from '@/utils/removeVietnameseTones'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [firstLoad, setFirstLoad] = useState(true)

  const [searchInput, setSearchInput] = useState('')
  const sort = searchParams.get('sort') || 'newest'
  const filterType = searchParams.get('type') || 'all'

  const debouncedUpdateSearch = useMemo(
    () =>
      debounce(value => {
        setSearchParams(prev => {
          const params = new URLSearchParams(prev)
          if (value) params.set('search', value)
          else params.delete('search')
          return params
        })
      }, 400),
    [setSearchParams]
  )

  const handleSearchInput = e => {
    const value = e.target.value
    setSearchInput(value)
    debouncedUpdateSearch(removeVietnameseTones(value))
  }

  const handleSortChange = value => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      params.set('sort', value)
      return params
    })
  }

  const handleFilterTypeChange = value => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      if (value === 'all') params.delete('type')
      else params.set('type', value)
      return params
    })
  }

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price_asc', label: 'Giá tăng dần' },
    { value: 'price_desc', label: 'Giá giảm dần' },
    { value: 'name_asc', label: 'Tên A-Z' },
    { value: 'name_desc', label: 'Tên Z-A' }
  ]

  const filterTypeOptions = [
    { value: 'all', label: 'Tất cả sản phẩm' },
    { value: 'isTopDeal', label: 'Top Deal' },
    { value: 'isFeatured', label: 'Nổi bật' }
  ]

  useEffect(() => {
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') || 'newest'

    if (firstLoad) setLoading(true)

    getProducts({
      search,
      sort,
      ...(filterType === 'isTopDeal' && { isTopDeal: true }),
      ...(filterType === 'isFeatured' && { isFeatured: true })
    })
      .then(result => setProducts(result))
      .catch(() => setProducts([]))
      .finally(() => {
        setLoading(false)
        setFirstLoad(false)
      })
  }, [searchParams])

  return (
    <>
      <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        <ShoppingBag className="w-8 h-8 text-blue-500" />
        Danh sách sản phẩm
        <span className="ml-2 text-base font-normal text-gray-400 dark:text-gray-400">({products.length} sản phẩm)</span>
      </h1>

      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-6">
        <Input
          allowClear
          prefix={<Search className="text-gray-400" size={18} />}
          className="w-full md:w-72"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchInput}
          onChange={handleSearchInput}
        />
        <Select
          className="md:ml-4 w-full md:w-52"
          value={sort}
          onChange={handleSortChange}
          options={sortOptions}
          suffixIcon={<SortDesc size={18} />}
        />
        <Select
          className="md:ml-4 w-full md:w-52"
          value={filterType}
          onChange={handleFilterTypeChange}
          options={filterTypeOptions}
          placeholder="Loại sản phẩm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <Spin size="large" tip="Đang tải sản phẩm..." />
        </div>
      ) : (
        <ProductList products={products} />
      )}
    </>
  )
}

export default Products
