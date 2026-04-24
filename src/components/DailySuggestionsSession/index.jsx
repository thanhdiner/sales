import React from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { Spin } from 'antd'
import ProductItem from '../Products/ProductItem'
import HeroBannerCard from './HeroBannerCard'
import SuggestionTabs from './SuggestionTabs'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getRecommendations } from '@/services/clientProductService'
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

  const websiteConfig = useSelector(state => state.websiteConfig?.data)
  const bannerConfig = websiteConfig?.dailySuggestionBanner || {}

  const handleTabChange = tabId => {
    const params = new URLSearchParams(searchParams)
    params.set('suggestionTab', tabId)
    setSearchParams(params, { replace: true })
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending: loading,
    isFetchingNextPage: loadingMore
  } = useInfiniteQuery({
    queryKey: ['recommendations', activeTab],
    queryFn: async ({ pageParam = 1 }) => {
      const apiTab = TAB_MAP[activeTab] || 'for-you'
      const res = await getRecommendations({ tab: apiTab, limit: 8, page: pageParam })
      return res
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined
    },
    staleTime: 5 * 60 * 1000 // Cache 5 phút
  })

  const products = data?.pages.flatMap(page => page.data || []) || []
  const hasMore = !!hasNextPage

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchNextPage()
    }
  }

  return (
    <div className="DailySuggestions-root">
      <SuggestionTabs activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="Suggestions-grid">
        <HeroBannerCard config={bannerConfig} />
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
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
          : products.map(prod => <ProductItem key={prod._id} product={prod} />)}
      </div>

      {hasMore && !loading && (
        <div className="Suggestions-loadmore-wrapper">
          <button className="load-more-btn" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? <Spin size="small" /> : 'Xem thêm'}
          </button>
        </div>
      )}
    </div>
  )
}
