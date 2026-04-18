import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { Spin } from 'antd'
import ProductItem from '../Products/ProductItem'
import HeroBannerCard from './HeroBannerCard'
import SuggestionTabs from './SuggestionTabs'
import { getRecommendations } from '@/services/productService'
import './DailySuggestionsSession.scss'

// Map FE tab id -> API tab param
const TAB_MAP = {
  foryou: 'for-you',
  deal: 'cheap-deals',
  new: 'newest'
}

export default function DailySuggestionsSession() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('suggestionTab') || 'foryou'

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const websiteConfig = useSelector(state => state.websiteConfig?.data)
  const bannerConfig = websiteConfig?.dailySuggestionBanner || {}

  const handleTabChange = (tabId) => {
    const params = new URLSearchParams(searchParams)
    params.set('suggestionTab', tabId)
    setSearchParams(params, { replace: true })
    setPage(1)
  }

  const fetchRecommendations = useCallback(async (tab, pageNum, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true)
    else setLoading(true)

    try {
      const apiTab = TAB_MAP[tab] || 'for-you'
      const res = await getRecommendations({ tab: apiTab, limit: 8, page: pageNum })
      if (isLoadMore) {
        setProducts(prev => [...prev, ...(res?.data || [])])
      } else {
        setProducts(res?.data || [])
      }
      setHasMore(!!res?.hasMore)
    } catch (err) {
      console.error('Failed to fetch recommendations:', err)
      if (!isLoadMore) setProducts([])
    } finally {
      if (isLoadMore) setLoadingMore(false)
      else setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecommendations(activeTab, page, page > 1)
  }, [activeTab, page, fetchRecommendations])

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setPage(p => p + 1)
    }
  }

  return (
    <div className="DailySuggestions-root">
      <SuggestionTabs activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="Suggestions-grid">
        <HeroBannerCard config={bannerConfig} />
        {loading && page === 1 ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="product mt-1 flex flex-col h-full">
              <div className="rounded-2xl border border-gray-200 bg-white p-3 animate-pulse flex-1 flex flex-col h-full dark:bg-gray-800 dark:border-gray-700">
                <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="mt-3 space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
                <div className="mt-3 h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="mt-3 h-8 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </div>
            </div>
          ))
        ) : (
          products.map((prod) => (
            <ProductItem key={prod._id} product={prod} />
          ))
        )}
      </div>
      
      {hasMore && !loading && (
        <div className="Suggestions-loadmore-wrapper">
          <button 
            className="load-more-btn" 
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? <Spin size="small" /> : 'Xem thêm'}
          </button>
        </div>
      )}
    </div>
  )
}
