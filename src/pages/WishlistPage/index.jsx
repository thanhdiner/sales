import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import { hasClientToken } from '@/lib/clientCache'
import { AUTHENTICATED_QUERY_SCOPE, GUEST_QUERY_SCOPE } from '@/lib/queryKeys'
import EmptyWishlistState from './components/EmptyWishlistState'
import WishlistFiltersSection from './components/WishlistFiltersSection'
import WishlistFooterSection from './components/WishlistFooterSection'
import WishlistHeaderSection from './components/WishlistHeaderSection'
import WishlistLoadingState from './components/WishlistLoadingState'
import WishlistMobileListSection from './components/WishlistMobileListSection'
import WishlistNoResult from './components/WishlistNoResult'
import WishlistTableSection from './components/WishlistTableSection'
import { useWishlistActions } from './hooks/useWishlistActions'
import { useWishlistData } from './hooks/useWishlistData'
import { useWishlistUrlState } from './hooks/useWishlistUrlState'
import {
  filterAndSortWishlistItems,
  formatWishlistPrice,
  getWishlistSummaryCounts,
  isWishlistItemInStock
} from './utils/wishlistPageUtils'
import { DEFAULT_FILTER, OUTLINE_BUTTON } from './constants'

function WishlistPage() {
  const { t, i18n } = useTranslation('clientWishlist')
  const language = i18n.resolvedLanguage || i18n.language
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const cartItems = useSelector(state => state.cart.items) || []
  const isLoggedIn = hasClientToken()
  const queryScope = isLoggedIn ? AUTHENTICATED_QUERY_SCOPE : GUEST_QUERY_SCOPE

  const { activeFilter, handleChangeFilter } = useWishlistUrlState()

  const {
    handleLoadMore,
    hasNextPage,
    inStockCount,
    isFetchingNextPage,
    loading,
    resetVisiblePageCount,
    totalItems,
    wishlistItems
  } = useWishlistData({
    isLoggedIn,
    queryClient,
    queryScope,
    t
  })

  const formatPrice = useCallback(price => formatWishlistPrice(price, language), [language])
  const filteredWishlist = useMemo(
    () => filterAndSortWishlistItems(wishlistItems, activeFilter),
    [activeFilter, wishlistItems]
  )
  const summaryCounts = useMemo(() => getWishlistSummaryCounts(wishlistItems), [wishlistItems])
  const canAddAll = useMemo(() => filteredWishlist.some(isWishlistItemInStock), [filteredWishlist])

  const { addingAllToCart, addingToCart, handleAddAllToCart, handleAddToCart, handleClearAll, handleRemove } = useWishlistActions({
    cartItems,
    dispatch,
    filteredWishlist,
    queryClient,
    queryScope,
    resetVisiblePageCount,
    t
  })

  if (loading) {
    return <WishlistLoadingState t={t} />
  }

  if (!totalItems) {
    return <EmptyWishlistState onBrowseProducts={() => navigate('/products')} t={t} />
  }

  return (
    <div className="bg-slate-50 px-4 py-8 dark:bg-gray-900">
      <SEO title={t('seo.titleWithCount', { count: totalItems })} noIndex />

      <main className="mx-auto w-full max-w-[1180px]">
        <WishlistHeaderSection
          addingAllToCart={addingAllToCart}
          canAddAll={canAddAll}
          inStockCount={inStockCount}
          onAddAllToCart={handleAddAllToCart}
          t={t}
          totalItems={totalItems}
        />

        <WishlistFiltersSection
          activeFilter={activeFilter}
          counts={summaryCounts}
          onChangeFilter={handleChangeFilter}
          onClearAll={handleClearAll}
          t={t}
        />

        {filteredWishlist.length > 0 ? (
          <>
            <WishlistTableSection
              addingToCart={addingToCart}
              filteredWishlist={filteredWishlist}
              formatPrice={formatPrice}
              language={language}
              loadedCount={wishlistItems.length}
              onAddToCart={handleAddToCart}
              onRemove={handleRemove}
              t={t}
              totalItems={totalItems}
            />

            <WishlistMobileListSection
              addingToCart={addingToCart}
              filteredWishlist={filteredWishlist}
              formatPrice={formatPrice}
              language={language}
              onAddToCart={handleAddToCart}
              onRemove={handleRemove}
              t={t}
            />

            {hasNextPage && (
              <div className="mt-4 flex justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <button onClick={handleLoadMore} disabled={isFetchingNextPage} className={`h-10 px-8 text-sm ${OUTLINE_BUTTON}`}>
                  {isFetchingNextPage ? t('loadMore.loading') : t('loadMore.default')}
                </button>
              </div>
            )}

            <WishlistFooterSection
              className="mt-4 md:hidden"
              filteredCount={filteredWishlist.length}
              loadedCount={wishlistItems.length}
              t={t}
              totalItems={totalItems}
            />
          </>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <WishlistNoResult onFilterReset={() => handleChangeFilter(DEFAULT_FILTER)} t={t} />
          </section>
        )}
      </main>
    </div>
  )
}

export default WishlistPage
