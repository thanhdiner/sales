import React from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import ProductItem from '../Products/ProductItem'
import HeroBannerCard from './HeroBannerCard'
import SuggestionTabs from './SuggestionTabs'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getRecommendations } from '@/services/clientProductService'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import './DailySuggestionsSection.scss'

// Map FE tab id -> API tab param
const TAB_MAP = {
  foryou: 'for-you',
  deal: 'cheap-deals',
  new: 'newest'
}

export default function DailySuggestionsSession() {
  const { t } = useTranslation('clientHome')
  const language = useCurrentLanguage()
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
    queryKey: ['recommendations', language, activeTab],
    queryFn: async ({ pageParam = 1 }) => {
      const apiTab = TAB_MAP[activeTab] || 'for-you'
      const res = await getRecommendations({ tab: apiTab, limit: 8, page: pageParam })
      return res
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined
    },
    placeholderData: (previousData, previousQuery) => (
      previousQuery?.queryKey?.[2] === activeTab ? previousData : undefined
    ),
    staleTime: 5 * 60 * 1000
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
                <div className="flex h-full flex-1 animate-pulse flex-col overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:rounded-[20px] dark:border-white/10 dark:bg-[#111315]">
                  <div className="h-[156px] border-b border-slate-100 bg-slate-50 p-2 sm:h-[190px] sm:p-3 xl:h-[200px] dark:border-white/10 dark:bg-[#17191c]">
                    <div className="h-full w-full rounded-[14px] bg-gray-200 dark:bg-[#202327]" />
                  </div>
                  <div className="mt-3 space-y-2 px-3 sm:px-4 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-[#202327] rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-[#202327] rounded w-2/3" />
                  </div>
                  <div className="mx-3 mt-3 h-6 bg-gray-200 dark:bg-[#202327] rounded w-1/2 sm:mx-4" />
                  <div className="mx-3 mb-3 mt-3 h-9 bg-gray-200 dark:bg-green-500/25 rounded-[10px] sm:mx-4 sm:mb-4 sm:h-11" />
                </div>
              </div>
            ))
          : products.map(prod => <ProductItem key={prod._id} product={prod} />)}
      </div>

      {hasMore && !loading && (
        <div className="Suggestions-loadmore-wrapper">
          <button className="load-more-btn" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? <Spin size="small" /> : t('dailySuggestionsSection.loadMore')}
          </button>
        </div>
      )}
    </div>
  )
}
