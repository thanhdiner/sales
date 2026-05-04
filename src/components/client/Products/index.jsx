import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Slider } from 'antd'
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  X
} from 'lucide-react'
import debounce from 'lodash.debounce'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getProductCategoryTree } from '@/services/client/commerce/productCategory'
import { getProducts } from '@/services/client/commerce/product'
import ProductListSkeleton from '../ProductListSkeleton'
import { removeVietnameseTones } from '@/utils/removeVietnameseTones'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import ProductList from './ProductList'
import SearchInput from '@/components/shared/SearchInput'
import SimpleSelect from '@/components/shared/SimpleSelect'

const PAGE_SIZE = 20

const SORT_OPTIONS = [
  { value: 'newest', labelKey: 'sort.newest' },
  { value: 'sold_desc', labelKey: 'sort.soldDesc' },
  { value: 'rate_desc', labelKey: 'sort.rateDesc' },
  { value: 'price_asc', labelKey: 'sort.priceAsc' },
  { value: 'price_desc', labelKey: 'sort.priceDesc' },
  { value: 'name_asc', labelKey: 'sort.nameAsc' },
  { value: 'name_desc', labelKey: 'sort.nameDesc' }
]

const PRICE_PRESETS = [
  { labelKey: 'pricePreset.all', min: 0, max: 0 },
  { labelKey: 'pricePreset.under100k', min: 0, max: 100000 },
  { labelKey: 'pricePreset.from100kTo500k', min: 100000, max: 500000 },
  { labelKey: 'pricePreset.from500kTo1m', min: 500000, max: 1000000 },
  { labelKey: 'pricePreset.from1mTo5m', min: 1000000, max: 5000000 },
  { labelKey: 'pricePreset.over5m', min: 5000000, max: 0 }
]

function flattenCategories(tree, depth = 0) {
  const result = []

  for (const node of tree) {
    result.push({
      value: node.value,
      label: `${'　'.repeat(depth)}${node.title}`
    })

    if (node.children?.length) {
      result.push(...flattenCategories(node.children, depth + 1))
    }
  }

  return result
}

function Products() {
  const { t } = useTranslation('clientProducts')
  const language = useCurrentLanguage()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [categories, setCategories] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [filterExpanded, setFilterExpanded] = useState(() => {
    if (typeof window === 'undefined') {
      return { category: true, price: true, rating: true, type: false }
    }

    const saved = window.localStorage.getItem('productsFilterExpanded')

    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return { category: true, price: true, rating: true, type: false }
      }
    }

    return { category: true, price: true, rating: true, type: false }
  })

  const [searchParams, setSearchParams] = useSearchParams()

  const sort = searchParams.get('sort') || 'newest'
  const filterType = searchParams.get('type') || 'all'
  const category = searchParams.get('category') || ''
  const minPrice = Number(searchParams.get('minPrice')) || 0
  const maxPrice = Number(searchParams.get('maxPrice')) || 0
  const minRate = Number(searchParams.get('minRate')) || 0
  const searchQuery = searchParams.get('q') || searchParams.get('search') || ''

  const sortOptions = useMemo(
    () => SORT_OPTIONS.map(option => ({ value: option.value, label: t(option.labelKey) })),
    [t]
  )

  const filterTypeOptions = useMemo(
    () => [
      { value: 'all', label: t('filter.all') },
      { value: 'isTopDeal', label: t('filter.topDeal') },
      { value: 'isFeatured', label: t('filter.featured') }
    ],
    [t]
  )

  const hasActiveFilter =
    filterType !== 'all' || category || minPrice > 0 || maxPrice > 0 || minRate > 0

  const debouncedUpdateSearch = useMemo(
    () =>
      debounce(value => {
        setSearchParams(prev => {
          const params = new URLSearchParams(prev)

          if (value) params.set('q', value)
          else params.delete('q')

          params.delete('search')

          params.delete('page')
          return params
        })
      }, 400),
    [setSearchParams]
  )

  useEffect(() => {
    return () => debouncedUpdateSearch.cancel()
  }, [debouncedUpdateSearch])

  useEffect(() => {
    setSearchInput(searchQuery)
  }, [language, searchQuery])

  useEffect(() => {
    getProductCategoryTree()
      .then(res => {
        const tree = res?.data || res?.categories || []
        setCategories(flattenCategories(tree))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setProducts([])
    setPage(1)
    setTotal(0)
    fetchProducts(1, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, searchParams])

  const setParam = useCallback(
    (key, value) => {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev)

        if (value !== undefined && value !== null && value !== '') params.set(key, value)
        else params.delete(key)

        if (key === 'q') params.delete('search')

        params.delete('page')
        return params
      })
    },
    [setSearchParams]
  )

  const handleSearchInput = e => {
    const value = e.target.value
    setSearchInput(value)
    debouncedUpdateSearch(removeVietnameseTones(value))
  }

  const handleSortChange = value => setParam('sort', value)
  const handleCategoryChange = value => setParam('category', value)
  const handleMinRateChange = value => setParam('minRate', value)
  const handleFilterTypeChange = value => setParam('type', value === 'all' ? '' : value)

  const handlePricePreset = preset => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)

      if (preset.min) params.set('minPrice', preset.min)
      else params.delete('minPrice')

      if (preset.max) params.set('maxPrice', preset.max)
      else params.delete('maxPrice')

      params.delete('page')
      return params
    })
  }

  const handlePriceSlider = ([min, max]) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)

      if (min) params.set('minPrice', min)
      else params.delete('minPrice')

      if (max) params.set('maxPrice', max)
      else params.delete('maxPrice')

      params.delete('page')
      return params
    })
  }

  const handleResetAll = () => {
    debouncedUpdateSearch.cancel()
    setSearchInput('')
    setShowFilter(false)
    setSearchParams({})
  }

  const fetchProducts = async (pageNum = 1, isNewFilter = false) => {
    if (isNewFilter) setLoading(true)
    else setLoadingMore(true)

    const searchRaw = searchParams.get('q') || searchParams.get('search') || ''

    const params = {
      search: removeVietnameseTones(searchRaw),
      sort: searchParams.get('sort') || 'newest',
      page: pageNum,
      limit: PAGE_SIZE,
      ...(searchParams.get('type') === 'isTopDeal' && { isTopDeal: true }),
      ...(searchParams.get('type') === 'isFeatured' && { isFeatured: true }),
      ...(searchParams.get('category') && { category: searchParams.get('category') }),
      ...(searchParams.get('minPrice') && { minPrice: searchParams.get('minPrice') }),
      ...(searchParams.get('maxPrice') && { maxPrice: searchParams.get('maxPrice') }),
      ...(searchParams.get('minRate') && { minRate: searchParams.get('minRate') })
    }

    try {
      const result = await getProducts(params)

      if (isNewFilter) {
        setProducts(result.data || [])
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

  const hasMore = products.length < total

  const toggleAccordion = key => {
    setFilterExpanded(prev => {
      const next = { ...prev, [key]: !prev[key] }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('productsFilterExpanded', JSON.stringify(next))
      }
      return next
    })
  }

  const activePricePreset = PRICE_PRESETS.findIndex(
    preset => preset.min === minPrice && preset.max === maxPrice
  )

  const getFilterTypeLabel = value => {
    const option = filterTypeOptions.find(item => item.value === value)
    return option?.label || value
  }

  const FilterPanel = () => (
    <div className="space-y-4">
      {hasActiveFilter && (
        <button
          onClick={handleResetAll}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
        >
          <RotateCcw className="h-3 w-3" />
          {t('filter.resetAll')}
        </button>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => toggleAccordion('category')}
          className="flex w-full items-center justify-between p-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50"
        >
          {t('filter.category')}
          {filterExpanded.category ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {filterExpanded.category && (
          <div className="space-y-1 p-3 pt-0">
            <button
              onClick={() => handleCategoryChange('')}
              className={`w-full rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                !category
                  ? 'bg-blue-50 font-medium text-blue-600 dark:bg-blue-900/30'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {t('filter.allCategories')}
            </button>

            {categories.map(item => (
              <button
                key={item.value}
                onClick={() => handleCategoryChange(item.value)}
                className={`w-full truncate rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                  category === item.value
                    ? 'bg-blue-50 font-medium text-blue-600 dark:bg-blue-900/30'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
                title={item.label}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => toggleAccordion('price')}
          className="flex w-full items-center justify-between p-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50"
        >
          {t('filter.priceRange')}
          {filterExpanded.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {filterExpanded.price && (
          <div className="p-3 pt-0">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {PRICE_PRESETS.map((preset, index) => (
                <button
                  key={preset.labelKey}
                  onClick={() => handlePricePreset(preset)}
                  className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    activePricePreset === index
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-500 dark:border-gray-600 dark:text-gray-400'
                  }`}
                >
                  {t(preset.labelKey)}
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
              tooltip={{ formatter: value => `${value.toLocaleString('vi-VN')}₫` }}
            />

            <div className="mt-1 flex justify-between text-xs text-gray-400">
              <span>{(minPrice || 0).toLocaleString('vi-VN')}₫</span>
              <span>{(maxPrice || 10000000).toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => toggleAccordion('rating')}
          className="flex w-full items-center justify-between p-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50"
        >
          {t('filter.minRating')}
          {filterExpanded.rating ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {filterExpanded.rating && (
          <div className="space-y-1 p-3 pt-0">
            {[0, 3, 3.5, 4, 4.5].map(value => (
              <button
                key={value}
                onClick={() => handleMinRateChange(value || '')}
                className={`flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                  minRate === value
                    ? 'bg-yellow-50 font-medium text-yellow-600 dark:bg-yellow-900/20'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {value === 0 ? (
                  <span>{t('filter.all')}</span>
                ) : (
                  <>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= value
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span>{t('filter.ratingUp', { value })}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => toggleAccordion('type')}
          className="flex w-full items-center justify-between p-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50"
        >
          {t('filter.productType')}
          {filterExpanded.type ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {filterExpanded.type && (
          <div className="space-y-1 p-3 pt-0">
            {filterTypeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleFilterTypeChange(option.value)}
                className={`w-full rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                  filterType === option.value
                    ? 'bg-blue-50 font-medium text-blue-600 dark:bg-blue-900/30'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="relative flex gap-6">
      <aside className="products-scrollbar sticky top-[80px] hidden max-h-[calc(100vh-100px)] w-60 flex-shrink-0 self-start overflow-y-auto lg:block">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2 font-bold text-gray-800 dark:text-white">
              <SlidersHorizontal className="h-4 w-4 text-blue-500" />
              {t('filter.title')}
            </span>
            {hasActiveFilter && (
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white">
                {t('filter.filtering')}
              </span>
            )}
          </div>
          <FilterPanel />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-6 flex flex-col gap-3">
          <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
            <ShoppingBag className="h-8 w-8 text-blue-500" />
            {t('page.title')}
            <span className="ml-2 text-base font-normal text-gray-400 dark:text-gray-400">
              {t('page.totalProducts', { count: total })}
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              className="min-w-[200px] max-w-sm flex-1 rounded-xl dark:border-gray-600 dark:bg-gray-800"
              placeholder={t('page.searchPlaceholder')}
              value={searchInput}
              onChange={handleSearchInput}
              onClear={() => {
                debouncedUpdateSearch.cancel()
                setSearchInput('')
                setParam('q', '')
              }}
            />

            <SimpleSelect
              value={sort}
              onChange={handleSortChange}
              options={sortOptions}
              className="w-48"
            />

            <button
              onClick={() => setShowFilter(prev => !prev)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors lg:hidden ${
                hasActiveFilter
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-200 text-gray-600 dark:border-gray-600 dark:text-gray-300'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t('filter.title')} {hasActiveFilter && t('filter.activeDot')}
            </button>
          </div>

          {hasActiveFilter && (
            <div className="flex flex-wrap gap-2">
              {category && (
                <FilterChip
                  label={categories.find(item => item.value === category)?.label || t('filter.category')}
                  onRemove={() => setParam('category', '')}
                />
              )}

              {(minPrice > 0 || maxPrice > 0) && (
                <FilterChip
                  label={`${minPrice > 0 ? `${minPrice.toLocaleString('vi-VN')}₫` : '0₫'} – ${
                    maxPrice > 0 ? `${maxPrice.toLocaleString('vi-VN')}₫` : '∞'
                  }`}
                  onRemove={() => handlePricePreset({ min: 0, max: 0 })}
                />
              )}

              {minRate > 0 && (
                <FilterChip
                  label={`⭐ ${minRate}★ ${t('filter.ratingUp', { value: minRate }).replace(`(${minRate}★)`, '')}`}
                  onRemove={() => setParam('minRate', '')}
                />
              )}

              {filterType !== 'all' && (
                <FilterChip
                  label={getFilterTypeLabel(filterType)}
                  onRemove={() => setParam('type', '')}
                />
              )}
            </div>
          )}
        </div>

        {showFilter && (
          <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 lg:hidden">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-bold text-gray-800 dark:text-white">{t('filter.advancedTitle')}</span>
              <button
                onClick={() => setShowFilter(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterPanel />
          </div>
        )}

        {loading ? (
          <ProductListSkeleton count={10} />
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              {t('page.emptyTitle')}
            </p>
            <p className="mb-4 mt-1 text-sm text-gray-400">
              {t('page.emptyDescription')}
            </p>
            <button
              onClick={handleResetAll}
              className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t('filter.reset')}
            </button>
          </div>
        ) : (
          <>
            <ProductList products={products} />
            <div className="my-8 flex justify-center">
              {hasMore && (
                <Button type="primary" loading={loadingMore} onClick={() => fetchProducts(page + 1)}>
                  {t('page.loadMore', { current: products.length, total })}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
      {label}
      <button onClick={onRemove} className="transition-colors hover:text-red-500">
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

export default Products
