import { useEffect, useMemo, useRef, useState } from 'react'
import { getClientFlashSales } from '@/services/flashSaleService'
import { FLASH_SALE_PAGE_LIMIT } from '../constants'
import { groupFlashSaleItems, normalizeFlashSaleResponse } from '../utils/flashSalePageUtils'

export function useFlashSaleData({ selectedCategory, language, uncategorizedLabel }) {
  const [flashSaleItems, setFlashSaleItems] = useState([])
  const [flashSaleCategories, setFlashSaleCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalFlashSaleItems, setTotalFlashSaleItems] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const previousCategoryRef = useRef('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let isMounted = true
    const categoryChanged = previousCategoryRef.current !== selectedCategory
    const shouldShowLoading = categoryChanged || flashSaleItems.length === 0
    previousCategoryRef.current = selectedCategory

    const fetchFlashSales = async () => {
      try {
        if (shouldShowLoading) setLoading(true)
        const res = await getClientFlashSales({
          mode: 'product',
          status: 'all',
          category: selectedCategory,
          page: 1,
          limit: FLASH_SALE_PAGE_LIMIT
        })
        const normalized = normalizeFlashSaleResponse(res, {
          selectedCategory,
          uncategorizedLabel
        })

        if (!isMounted) return

        setFlashSaleItems(normalized.items)
        setFlashSaleCategories(normalized.categories)
        setCurrentPage(normalized.currentPage)
        setTotalFlashSaleItems(normalized.total)
      } finally {
        if (isMounted && shouldShowLoading) setLoading(false)
      }
    }

    fetchFlashSales()

    return () => {
      isMounted = false
    }
  }, [selectedCategory, language, uncategorizedLabel])

  const handleLoadMore = async () => {
    if (loadingMore || flashSaleItems.length >= totalFlashSaleItems) return

    const nextPage = currentPage + 1
    setLoadingMore(true)

    try {
      const res = await getClientFlashSales({
        mode: 'product',
        status: 'all',
        category: selectedCategory,
        page: nextPage,
        limit: FLASH_SALE_PAGE_LIMIT
      })
      const normalized = normalizeFlashSaleResponse(res, {
        selectedCategory,
        uncategorizedLabel
      })

      setFlashSaleItems(prev => [...prev, ...normalized.items])
      setCurrentPage(normalized.currentPage || nextPage)
      setTotalFlashSaleItems(normalized.total)
    } finally {
      setLoadingMore(false)
    }
  }

  const filteredFlashSales = useMemo(() => groupFlashSaleItems(flashSaleItems), [flashSaleItems])
  const activeFlashSales = filteredFlashSales.filter(sale => sale.status === 'active')
  const upcomingFlashSales = filteredFlashSales.filter(sale => sale.status === 'scheduled')
  const hasMoreFlashSales = flashSaleItems.length < totalFlashSaleItems

  return {
    activeFlashSales,
    currentTime,
    filteredFlashSales,
    flashSaleCategories,
    handleLoadMore,
    hasMoreFlashSales,
    loading,
    loadingMore,
    upcomingFlashSales
  }
}
