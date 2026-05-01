import { useCallback, useEffect, useMemo, useState } from 'react'
import debounce from 'lodash.debounce'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useCategoriesQuery } from '@/hooks/queries/useSharedAppQueries'
import { getProductsByCategory } from '@/services/client/commerce/productCategory'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import {
  createChildCategoryProductCountMap,
  createProductSearchIndex,
  findCategoryBySlug,
  flattenCategories,
  matchesProductFilters,
  matchesProductSearch,
  normalizeSearchValue,
  sortProducts
} from '../utils/productCategoryUtils'

const SEARCH_DEBOUNCE_MS = 300
const DEFAULT_SORT = 'recommended'
const SORT_OPTIONS = ['recommended', 'newest', 'sold_desc', 'rate_desc', 'price_asc', 'price_desc', 'name_asc', 'name_desc']
const SORT_ALIASES = {
  name: 'name_asc',
  'price-low': 'price_asc',
  'price-high': 'price_desc'
}
const PAGE_SIZE = 20
const CATEGORY_NOT_FOUND_ERROR_KEY = 'categoryPage.error.notFound'

function getValidPage(value) {
  const page = Number(value)

  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
}

function getValidSort(value) {
  if (SORT_ALIASES[value]) return SORT_ALIASES[value]

  return SORT_OPTIONS.includes(value) ? value : DEFAULT_SORT
}

function getQueryNumber(searchParams, keys = []) {
  for (const key of keys) {
    const rawValue = searchParams.get(key)

    if (rawValue !== null && rawValue !== '') {
      const value = Number(rawValue)

      return Number.isFinite(value) ? value : 0
    }
  }

  return 0
}

function getQueryBoolean(searchParams, key) {
  const value = String(searchParams.get(key) || '').toLowerCase()

  return value === 'true' || value === '1' || value === 'yes'
}

function setQueryValue(params, key, value) {
  const shouldDelete =
    value === undefined ||
    value === null ||
    value === '' ||
    (key === 'sort' && value === DEFAULT_SORT) ||
    (key === 'page' && Number(value) <= 1)

  if (shouldDelete) {
    params.delete(key)
    return
  }

  params.set(key, String(value))
}

function mergeCategoryDetail(apiCategory, treeCategory) {
  if (!apiCategory && !treeCategory) return null

  return {
    ...(apiCategory || {}),
    ...(treeCategory || {}),
    _id: apiCategory?._id || treeCategory?.value || treeCategory?._id,
    value: treeCategory?.value || apiCategory?._id || apiCategory?.value,
    children: treeCategory?.children || apiCategory?.children || []
  }
}

function useProductCategory(slug) {
  const language = useCurrentLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const querySearch = searchParams.get('q') || ''
  const querySort = getValidSort(searchParams.get('sort') || DEFAULT_SORT)
  const queryPage = getValidPage(searchParams.get('page'))

  const [searchInput, setSearchInput] = useState(querySearch)
  const [searchTerm, setSearchTerm] = useState(querySearch)
  const [sortBy, setSortByState] = useState(querySort)
  const [currentPage, setCurrentPage] = useState(queryPage)
  const { data: categories = [] } = useCategoriesQuery()
  const filters = useMemo(
    () => ({
      minPrice: getQueryNumber(searchParams, ['minPrice']),
      maxPrice: getQueryNumber(searchParams, ['maxPrice']),
      rating: getQueryNumber(searchParams, ['rating', 'minRate']),
      inStock: getQueryBoolean(searchParams, 'inStock'),
      isTopDeal: getQueryBoolean(searchParams, 'isTopDeal'),
      isFeatured: getQueryBoolean(searchParams, 'isFeatured')
    }),
    [searchParams]
  )
  const {
    data: categoryProductsData,
    isError,
    isPending: loading
  } = useQuery({
    queryKey: ['productCategoryProducts', language, slug],
    queryFn: async () => {
      const res = await getProductsByCategory(slug)

      if (res?.code !== 200) {
        throw new Error(CATEGORY_NOT_FOUND_ERROR_KEY)
      }

      return {
        category: res.category || null,
        products: res.data || []
      }
    },
    enabled: Boolean(slug),
    placeholderData: (previousData, previousQuery) => (
      previousQuery?.queryKey?.[2] === slug ? previousData : undefined
    ),
    staleTime: 5 * 60 * 1000
  })

  const activeTreeCategory = useMemo(() => findCategoryBySlug(categories, slug), [categories, slug])
  const category = useMemo(
    () => mergeCategoryDetail(categoryProductsData?.category || null, activeTreeCategory),
    [activeTreeCategory, categoryProductsData]
  )
  const products = categoryProductsData?.products || []
  const categoryChildren = category?.children || []
  const childCategoryProductCounts = useMemo(
    () => createChildCategoryProductCountMap(categoryChildren, products),
    [categoryChildren, products]
  )
  const errorKey = isError ? CATEGORY_NOT_FOUND_ERROR_KEY : ''

  const flattenedCategories = useMemo(() => flattenCategories(categories), [categories])

  const updateSearchParams = useCallback(
    updates => {
      setSearchParams(currentParams => {
        const nextParams = new URLSearchParams(currentParams)

        Object.entries(updates).forEach(([key, value]) => {
          setQueryValue(nextParams, key, value)
        })

        return nextParams
      })
    },
    [setSearchParams]
  )

  const debouncedSyncSearch = useMemo(
    () =>
      debounce(value => {
        const nextValue = value.trim()

        setSearchTerm(nextValue)
        setCurrentPage(1)
        updateSearchParams({ q: nextValue, page: '1' })
      }, SEARCH_DEBOUNCE_MS),
    [updateSearchParams]
  )

  const normalizedSearchTerm = useMemo(() => normalizeSearchValue(searchTerm), [searchTerm])
  const productSearchIndex = useMemo(() => createProductSearchIndex(products), [products])

  const filteredProducts = useMemo(
    () =>
      sortProducts(
        productSearchIndex
          .filter(
            searchItem =>
              matchesProductSearch(searchItem, normalizedSearchTerm) &&
              matchesProductFilters(searchItem.product, filters)
          )
          .map(searchItem => searchItem.product),
        sortBy
      ),
    [filters, productSearchIndex, normalizedSearchTerm, sortBy]
  )

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const activePage = Math.min(currentPage, totalPages)

  const paginatedProducts = useMemo(
    () => filteredProducts.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE),
    [activePage, filteredProducts]
  )

  useEffect(() => {
    return () => debouncedSyncSearch.cancel()
  }, [debouncedSyncSearch])

  useEffect(() => {
    setSearchInput(querySearch)
    setSearchTerm(querySearch)
    setSortByState(querySort)
    setCurrentPage(queryPage)
    debouncedSyncSearch.cancel()
  }, [slug, querySearch, querySort, queryPage, debouncedSyncSearch])

  useEffect(() => {
    if (!loading && currentPage > totalPages) {
      setCurrentPage(totalPages)
      updateSearchParams({ page: String(totalPages) })
    }
  }, [currentPage, loading, totalPages, updateSearchParams])

  const handleSearchChange = event => {
    const value = event.target.value

    setSearchInput(value)
    debouncedSyncSearch(value)
  }

  const clearSearch = () => {
    debouncedSyncSearch.cancel()
    setSearchInput('')
    setSearchTerm('')
    setCurrentPage(1)
    updateSearchParams({ q: '', page: '1' })
  }

  const setSortBy = value => {
    const nextSort = getValidSort(value)

    setSortByState(nextSort)
    setCurrentPage(1)
    updateSearchParams({ sort: nextSort, page: '1' })
  }

  const setPage = page => {
    const nextPage = Math.min(Math.max(1, getValidPage(page)), totalPages)

    setCurrentPage(nextPage)
    updateSearchParams({ page: String(nextPage) })
  }

  return {
    category,
    products,
    loading,
    errorKey,
    error: errorKey,
    searchInput,
    sortBy,
    currentPage: activePage,
    totalPages,
    limit: PAGE_SIZE,
    categories,
    categoryChildren,
    childCategoryProductCounts,
    filters,
    viewMode: 'grid',
    flattenedCategories,
    filteredProducts,
    paginatedProducts,
    totalProducts: products.length,
    resultCount: filteredProducts.length,
    hasSearchInput: searchInput.trim().length > 0,
    handleSearchChange,
    clearSearch,
    setSortBy,
    setPage
  }
}

export default useProductCategory
