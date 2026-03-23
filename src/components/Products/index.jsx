import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { getProducts } from '../../services/productService'
import { getProductCategoryTree } from '../../services/productCategoryService'
import ProductList from './ProductList'
import {
  ShoppingBag, Search, SortDesc, SlidersHorizontal,
  X, ChevronDown, ChevronUp, Star, RotateCcw
} from 'lucide-react'
import { Button, Slider, Select } from 'antd'
import { useSearchParams } from 'react-router-dom'
import debounce from 'lodash.debounce'
import { removeVietnameseTones } from '@/utils/removeVietnameseTones'
import ProductListSkeleton from '../ProductListSkeleton'

const PAGE_SIZE = 20

// Làm phẳng category tree thành danh sách select
function flattenCategories(tree, depth = 0) {
  const result = []
  for (const node of tree) {
    result.push({ value: node._id, label: ('　'.repeat(depth)) + node.title })
    if (node.children?.length) {
      result.push(...flattenCategories(node.children, depth + 1))
    }
  }
  return result
}

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Mới nhất' },
  { value: 'sold_desc',  label: 'Bán chạy nhất' },
  { value: 'rate_desc',  label: 'Đánh giá cao nhất' },
  { value: 'price_asc',  label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'name_asc',   label: 'Tên A–Z' },
  { value: 'name_desc',  label: 'Tên Z–A' }
]

const PRICE_PRESETS = [
  { label: 'Tất cả', min: 0, max: 0 },
  { label: 'Dưới 100k', min: 0, max: 100000 },
  { label: '100k – 500k', min: 100000, max: 500000 },
  { label: '500k – 1tr', min: 500000, max: 1000000 },
  { label: '1tr – 5tr', min: 1000000, max: 5000000 },
  { label: 'Trên 5tr', min: 5000000, max: 0 }
]

function Products() {
  const [products, setProducts]     = useState([])
  const [total, setTotal]           = useState(0)
  const [page, setPage]             = useState(1)
  const [loading, setLoading]       = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [categories, setCategories] = useState([])          // flat list
  const [showFilter, setShowFilter] = useState(false)       // mobile toggle
  const [filterExpanded, setFilterExpanded] = useState({    // desktop accordion
    category: true, price: true, rating: true, type: false
  })

  const [searchInput, setSearchInput]   = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  // ─── Read params ─────────────────────────────────────────
  const sort      = searchParams.get('sort')     || 'newest'
  const filterType= searchParams.get('type')     || 'all'
  const category  = searchParams.get('category') || ''
  const minPrice  = Number(searchParams.get('minPrice')) || 0
  const maxPrice  = Number(searchParams.get('maxPrice')) || 0
  const minRate   = Number(searchParams.get('minRate'))  || 0

  // Detect if any advanced filter is active
  const hasActiveFilter = category || minPrice > 0 || maxPrice > 0 || minRate > 0 || filterType !== 'all'

  // ─── Load categories ──────────────────────────────────────
  useEffect(() => {
    getProductCategoryTree()
      .then(res => {
        const tree = res.categories || res || []
        setCategories(flattenCategories(tree))
      })
      .catch(() => {})
  }, [])

  // Sync URL search → local input
  useEffect(() => {
    const urlSearch = searchParams.get('search') || ''
    setSearchInput(urlSearch)
  }, []) // eslint-disable-line

  // ─── Debounced search ─────────────────────────────────────
  const debouncedUpdateSearch = useMemo(
    () => debounce(value => {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev)
        if (value) params.set('search', value)
        else params.delete('search')
        params.delete('page')
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

  // ─── Param setters ────────────────────────────────────────
  const setParam = useCallback((key, value) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      if (value) params.set(key, value)
      else params.delete(key)
      params.delete('page')
      return params
    })
  }, [setSearchParams])

  const handleSortChange       = v => setParam('sort', v)
  const handleCategoryChange   = v => setParam('category', v || '')
  const handleFilterTypeChange = v => setParam('type', v === 'all' ? '' : v)
  const handleMinRateChange    = v => setParam('minRate', v || '')

  const handlePricePreset = preset => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev)
      if (preset.min) p.set('minPrice', preset.min); else p.delete('minPrice')
      if (preset.max) p.set('maxPrice', preset.max); else p.delete('maxPrice')
      p.delete('page')
      return p
    })
  }

  const handlePriceSlider = ([min, max]) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev)
      if (min) p.set('minPrice', min); else p.delete('minPrice')
      if (max) p.set('maxPrice', max); else p.delete('maxPrice')
      p.delete('page')
      return p
    })
  }

  const handleResetAll = () => {
    setSearchInput('')
    setSearchParams({})
  }

  // ─── Fetch products ───────────────────────────────────────
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
    const params = {
      search:   removeVietnameseTones(searchRaw),
      sort:     searchParams.get('sort') || 'newest',
      page:     pageNum,
      limit:    PAGE_SIZE,
      ...(searchParams.get('type') === 'isTopDeal'  && { isTopDeal:  true }),
      ...(searchParams.get('type') === 'isFeatured' && { isFeatured: true }),
      ...(searchParams.get('category')  && { category:  searchParams.get('category')  }),
      ...(searchParams.get('minPrice')  && { minPrice:  searchParams.get('minPrice')  }),
      ...(searchParams.get('maxPrice')  && { maxPrice:  searchParams.get('maxPrice')  }),
      ...(searchParams.get('minRate')   && { minRate:   searchParams.get('minRate')   })
    }

    try {
      const result = await getProducts(params)
      if (isNewFilter) setProducts(result.data || [])
      else setProducts(prev => [...prev, ...(result.data || [])])
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

  const hasMore = products.length < total

  // ─── Accordion helper ─────────────────────────────────────
  const toggle = key => setFilterExpanded(p => ({ ...p, [key]: !p[key] }))

  // ─── Active price preset ──────────────────────────────────
  const activePricePreset = PRICE_PRESETS.findIndex(
    p => p.min === minPrice && p.max === maxPrice
  )

  // ─── Filter Panel (reusable for sidebar + drawer) ─────────
  const FilterPanel = () => (
    <div className="space-y-4">

      {/* Reset */}
      {hasActiveFilter && (
        <button
          onClick={handleResetAll}
          className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium px-3 py-1.5 border border-red-200 rounded-lg w-full justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Xóa tất cả bộ lọc
        </button>
      )}

      {/* Category */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <button
          onClick={() => toggle('category')}
          className="w-full flex items-center justify-between p-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          Danh mục
          {filterExpanded.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {filterExpanded.category && (
          <div className="p-3 pt-0 space-y-1">
            <button
              onClick={() => handleCategoryChange('')}
              className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${!category ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              Tất cả danh mục
            </button>
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors truncate ${category === cat.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                title={cat.label}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <button
          onClick={() => toggle('price')}
          className="w-full flex items-center justify-between p-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          Khoảng giá
          {filterExpanded.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {filterExpanded.price && (
          <div className="p-3 pt-0">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {PRICE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePricePreset(preset)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    activePricePreset === idx
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <Slider
              range
              min={0}
              max={10000000}
              step={100000}
              value={[minPrice || 0, maxPrice || 10000000]}
              onChange={handlePriceSlider}
              tooltip={{ formatter: v => v.toLocaleString('vi-VN') + '₫' }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{(minPrice || 0).toLocaleString('vi-VN')}₫</span>
              <span>{(maxPrice || 10000000).toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <button
          onClick={() => toggle('rating')}
          className="w-full flex items-center justify-between p-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          Đánh giá tối thiểu
          {filterExpanded.rating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {filterExpanded.rating && (
          <div className="p-3 pt-0 space-y-1">
            {[0, 3, 3.5, 4, 4.5].map(r => (
              <button
                key={r}
                onClick={() => handleMinRateChange(r || '')}
                className={`w-full flex items-center gap-1.5 text-sm px-2 py-1.5 rounded-lg transition-colors ${
                  minRate === r ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {r === 0 ? (
                  <span>Tất cả</span>
                ) : (
                  <>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${s <= r ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span>trở lên ({r}★)</span>
                  </>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Type */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <button
          onClick={() => toggle('type')}
          className="w-full flex items-center justify-between p-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          Loại sản phẩm
          {filterExpanded.type ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {filterExpanded.type && (
          <div className="p-3 pt-0 space-y-1">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'isTopDeal', label: '🔥 Top Deal' },
              { value: 'isFeatured', label: '⭐ Nổi bật' }
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => handleFilterTypeChange(opt.value)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                  filterType === opt.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex gap-6 relative">
      {/* ── Desktop Sidebar ─────────────────────────── */}
      <aside className="hidden lg:block w-60 flex-shrink-0">
        <div className="sticky top-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-500" />
              Bộ lọc
            </span>
            {hasActiveFilter && (
              <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium">
                Đang lọc
              </span>
            )}
          </div>
          <FilterPanel />
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Header + Controls */}
        <div className="flex flex-col gap-3 mb-6">
          <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            <ShoppingBag className="w-8 h-8 text-blue-500" />
            Danh sách sản phẩm
            <span className="ml-2 text-base font-normal text-gray-400">({total} sản phẩm)</span>
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchInput}
                onChange={handleSearchInput}
              />
              {searchInput && (
                <button
                  onClick={() => { setSearchInput(''); setParam('search', '') }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <Select
              value={sort}
              onChange={handleSortChange}
              options={SORT_OPTIONS}
              suffixIcon={<SortDesc size={16} />}
              className="w-48"
              size="middle"
            />

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilter(v => !v)}
              className={`lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
                hasActiveFilter
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Bộ lọc {hasActiveFilter && '●'}
            </button>
          </div>

          {/* Active filter chips */}
          {hasActiveFilter && (
            <div className="flex flex-wrap gap-2">
              {category && (
                <FilterChip
                  label={categories.find(c => c.value === category)?.label || 'Danh mục'}
                  onRemove={() => setParam('category', '')}
                />
              )}
              {(minPrice > 0 || maxPrice > 0) && (
                <FilterChip
                  label={`${minPrice > 0 ? minPrice.toLocaleString('vi-VN') + '₫' : '0₫'} – ${maxPrice > 0 ? maxPrice.toLocaleString('vi-VN') + '₫' : '∞'}`}
                  onRemove={() => handlePricePreset({ min: 0, max: 0 })}
                />
              )}
              {minRate > 0 && (
                <FilterChip label={`⭐ ${minRate}★ trở lên`} onRemove={() => setParam('minRate', '')} />
              )}
              {filterType !== 'all' && (
                <FilterChip label={filterType === 'isTopDeal' ? '🔥 Top Deal' : '⭐ Nổi bật'} onRemove={() => setParam('type', '')} />
              )}
            </div>
          )}
        </div>

        {/* Mobile Filter Drawer */}
        {showFilter && (
          <div className="lg:hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-gray-800 dark:text-white">Bộ lọc nâng cao</span>
              <button onClick={() => setShowFilter(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel />
          </div>
        )}

        {/* Products */}
        {loading ? (
          <ProductListSkeleton count={10} />
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Không tìm thấy sản phẩm nào</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            <button onClick={handleResetAll} className="text-sm text-blue-500 hover:underline flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" /> Xóa bộ lọc
            </button>
          </div>
        ) : (
          <>
            <ProductList products={products} />
            <div className="flex justify-center my-8">
              {hasMore && (
                <Button type="primary" loading={loadingMore} onClick={() => fetchProducts(page + 1)}>
                  Xem thêm ({products.length}/{total})
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Filter chip badge
function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
      {label}
      <button onClick={onRemove} className="hover:text-red-500 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

export default Products
