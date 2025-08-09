import React, { useEffect, useState, useMemo } from 'react'
import { getProducts } from '../../services/productService'
import ProductList from './ProductList'
import { ShoppingBag, Search, SortDesc } from 'lucide-react'
import { Input, Select, Spin, Button } from 'antd'
import { useSearchParams } from 'react-router-dom'
import debounce from 'lodash.debounce'
import { removeVietnameseTones } from '@/utils/removeVietnameseTones'
import ProductListSkeleton from '../ProductListSkeleton'

const PAGE_SIZE = 20

function Products() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const [searchInput, setSearchInput] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
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
    setProducts([])
    setPage(1)
    setTotal(0)
    fetchProducts(1, true)
    // eslint-disable-next-line
  }, [searchParams])

  const fetchProducts = async (pageNum = 1, isNewFilter = false) => {
    if (isNewFilter) setLoading(true)
    else setLoadingMore(true)

    const searchRaw = searchParams.get('search') || ''
    const search = removeVietnameseTones(searchRaw)
    const sort = searchParams.get('sort') || 'newest'

    try {
      const result = await getProducts({
        search,
        sort,
        page: pageNum,
        limit: PAGE_SIZE,
        ...(filterType === 'isTopDeal' && { isTopDeal: true }),
        ...(filterType === 'isFeatured' && { isFeatured: true })
      })

      if (isNewFilter) {
        setProducts(result.data)
      } else {
        setProducts(prev => [...prev, ...(result.data || [])])
      }
      setTotal(result.total || 0)
      setPage(pageNum)
    } catch {
      setProducts([])
      setTotal(0)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const hasMore = (Array.isArray(products) ? products.length : 0) < total

  return (
    <>
      <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 ml-4">
        <ShoppingBag className="w-8 h-8 text-blue-500" />
        Danh sách sản phẩm
        <span className="ml-2 text-base font-normal text-gray-400 dark:text-gray-400">({total} sản phẩm)</span>
      </h1>

      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-6 ml-4">
        <Input
          allowClear
          prefix={<Search className="text-gray-400" size={18} />}
          className="w-full md:w-72 dark:bg-gray-800 dark:text-white dark:border-gray-600"
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
        <ProductListSkeleton count={10} />
      ) : (
        <>
          <ProductList products={products} />
          <div className="flex justify-center my-8">
            {hasMore && (
              <Button type="primary" loading={loadingMore} onClick={() => fetchProducts(page + 1)}>
                Xem thêm
              </Button>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default Products
