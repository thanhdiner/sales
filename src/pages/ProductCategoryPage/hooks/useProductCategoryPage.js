import { useCallback, useEffect, useMemo, useState } from 'react'
import debounce from 'lodash.debounce'
import { useSearchParams } from 'react-router-dom'
import { useCategoriesQuery } from '@/hooks/queries/useSharedAppQueries'
import { getProductsByCategory } from '@/services/clientProductCategoryService'
import { createProductSearchIndex, flattenCategories, matchesProductFeatures, matchesProductSearch, normalizeSearchValue, sortProducts } from '../utils/productCategoryUtils'

const SEARCH_DEBOUNCE_MS = 300
const DEFAULT_SORT = 'name'
const SORT_OPTIONS = ['name', 'price-low', 'price-high']
const FEATURE_OPTIONS = ['auto-delivery', 'licensed', 'support', 'featured']
const PAGE_SIZE = 20

function useProductCategoryPage(slug) {
  const [searchParams, setSearchParams] = useSearchParams()
  const querySearch = searchParams.get('q') || ''
  const querySort = searchParams.get('sort') || DEFAULT_SORT
  const queryFeatures = searchParams.get('features') || ''
  const queryPage = Number(searchParams.get('page')) || 1
  const initialPage = Math.max(1, queryPage)
  const initialSort = SORT_OPTIONS.includes(querySort) ? querySort : DEFAULT_SORT
  const initialFeatures = useMemo(
    () => queryFeatures.split(',').filter(feature => FEATURE_OPTIONS.includes(feature)),
    [queryFeatures]
  )
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState(querySearch)
  const [searchTerm, setSearchTerm] = useState(querySearch)
  const [sortBy, setSortByState] = useState(initialSort)
  const [selectedFeatures, setSelectedFeatures] = useState(initialFeatures)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const { data: categories = [] } = useCategoriesQuery()

  const flattenedCategories = useMemo(() => flattenCategories(categories), [categories])

  const updateSearchParams = useCallback((key, value) => {
    setSearchParams(currentParams => {
      const nextParams = new URLSearchParams(currentParams)

      if (!value || (key === 'sort' && value === DEFAULT_SORT) || (key === 'page' && Number(value) <= 1)) {
        nextParams.delete(key)
      } else {
        nextParams.set(key, value)
      }

      return nextParams
    })
  }, [setSearchParams])

  const debouncedSyncSearch = useMemo(
    () => debounce(value => {
      setSearchTerm(value)
      setCurrentPage(1)
      updateSearchParams('q', value.trim())
      updateSearchParams('page', '1')
    }, SEARCH_DEBOUNCE_MS),
    [updateSearchParams]
  )

  const normalizedSearchTerm = useMemo(() => normalizeSearchValue(searchTerm), [searchTerm])
  const productSearchIndex = useMemo(() => createProductSearchIndex(products), [products])

  const filteredProducts = useMemo(
    () =>
      sortProducts(
        productSearchIndex
          .filter(searchItem => matchesProductSearch(searchItem, normalizedSearchTerm) && matchesProductFeatures(searchItem, selectedFeatures))
          .map(searchItem => searchItem.product),
        sortBy
      ),
    [productSearchIndex, normalizedSearchTerm, selectedFeatures, sortBy]
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
    setSortByState(initialSort)
    setSelectedFeatures(initialFeatures)
    setCurrentPage(initialPage)
    debouncedSyncSearch.cancel()
  }, [slug, querySearch, initialSort, initialFeatures, initialPage, debouncedSyncSearch])

  useEffect(() => {
    if (!loading && currentPage > totalPages) {
      setCurrentPage(totalPages)
      updateSearchParams('page', String(totalPages))
    }
  }, [currentPage, loading, totalPages, updateSearchParams])

  useEffect(() => {
    setLoading(true)
    setError('')
    setCategory(null)
    setProducts([])

    getProductsByCategory(slug)
      .then(res => {
        if (res?.code === 200) {
          setCategory(res.category)
          setProducts(res.data)
        } else {
          setError('Không tìm thấy danh mục hoặc có lỗi xảy ra.')
        }
      })
      .catch(() => setError('Không tìm thấy danh mục hoặc có lỗi xảy ra.'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleSearchChange = event => {
    const value = event.target.value
    setSearchInput(value)
    debouncedSyncSearch(value)
  }

  const setSortBy = value => {
    const nextSort = SORT_OPTIONS.includes(value) ? value : DEFAULT_SORT
    setSortByState(nextSort)
    setCurrentPage(1)
    updateSearchParams('sort', nextSort)
    updateSearchParams('page', '1')
  }

  const setFeatureFilters = features => {
    const nextFeatures = features.filter(feature => FEATURE_OPTIONS.includes(feature))
    setSelectedFeatures(nextFeatures)
    setCurrentPage(1)
    updateSearchParams('features', nextFeatures.join(','))
    updateSearchParams('page', '1')
  }

  const setPage = page => {
    const nextPage = Math.min(Math.max(1, page), totalPages)
    setCurrentPage(nextPage)
    updateSearchParams('page', String(nextPage))
  }

  return {
    category,
    products,
    loading,
    error,
    searchInput,
    sortBy,
    selectedFeatures,
    currentPage: activePage,
    totalPages,
    categories,
    flattenedCategories,
    filteredProducts,
    paginatedProducts,
    handleSearchChange,
    setSortBy,
    setFeatureFilters,
    setPage
  }
}

export default useProductCategoryPage
