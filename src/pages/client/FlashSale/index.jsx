import { useMemo } from 'react'
import { Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import ClientBreadcrumb from '@/components/client/Breadcrumb'
import SEO from '@/components/shared/SEO'
import ActiveFlashSales from './sections/ActiveFlashSales'
import CategoryTabs from './components/CategoryTabs'
import EmptyFlashSaleState from './components/EmptyFlashSaleState'
import FlashSaleLoadingState from './components/FlashSaleLoadingState'
import LoadMoreButton from './components/LoadMoreButton'
import TrustHighlights from './sections/TrustHighlights'
import UpcomingFlashSales from './sections/UpcomingFlashSales'
import { useFlashSaleCategoryTabs } from './hooks/useFlashSaleCategoryTabs'
import { useFlashSaleData } from './hooks/useFlashSaleData'
import { useFlashSaleProductActions } from './hooks/useFlashSaleProductActions'
import { formatFlashSaleCurrency } from './utils/flashSaleUtils'

function FlashSale() {
  const { t, i18n } = useTranslation('clientFlashSale')
  const [searchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') || 'all'

  const {
    activeFlashSales,
    currentTime,
    filteredFlashSales,
    flashSaleCategories,
    handleLoadMore,
    hasMoreFlashSales,
    loading,
    loadingMore,
    upcomingFlashSales
  } = useFlashSaleData({
    language: i18n.language,
    selectedCategory,
    uncategorizedLabel: t('category.uncategorized')
  })

  const categories = useMemo(
    () => [
      { key: 'all', label: t('category.all'), icon: Tag },
      ...flashSaleCategories.map(category => ({
        key: category.key,
        label: category.label,
        icon: Tag
      }))
    ],
    [flashSaleCategories, t]
  )

  const {
    handleCategoryChange,
    handleScrollTabs,
    handleTabsClickCapture,
    handleTabsPointerDown,
    handleTabsPointerMove,
    handleTabsPointerUp,
    isDraggingTabs,
    tabsRef
  } = useFlashSaleCategoryTabs({
    categories,
    loading,
    selectedCategory
  })

  const {
    buyNowLoading,
    compareItems,
    handleFlashSaleBuyNow,
    handleToggleCompare,
    handleToggleWishlist,
    wishlistItems,
    wishlistLoading
  } = useFlashSaleProductActions({ t })

  const productCardProps = {
    buyNowLoading,
    compareItems,
    formatCurrency: amount => formatFlashSaleCurrency(amount, i18n.language),
    onBuyNow: handleFlashSaleBuyNow,
    onToggleCompare: handleToggleCompare,
    onToggleWishlist: handleToggleWishlist,
    wishlistItems,
    wishlistLoading
  }

  return (
    <div className="min-h-screen rounded-tl-[8px] rounded-tr-[8px] bg-white text-slate-900 shadow dark:bg-gray-800 dark:text-slate-100">
      <SEO title={t('seo.title')} description={t('seo.description')} url="https://smartmall.site/flash-sale" />

      <main>
        <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <ClientBreadcrumb
            className="mb-4"
            label={t('breadcrumb.label')}
            items={[
              { label: t('breadcrumb.home'), to: '/' },
              { label: t('breadcrumb.flashSale') }
            ]}
          />

          <CategoryTabs
            categories={categories}
            isDraggingTabs={isDraggingTabs}
            onCategoryChange={handleCategoryChange}
            onClickCapture={handleTabsClickCapture}
            onPointerDown={handleTabsPointerDown}
            onPointerMove={handleTabsPointerMove}
            onPointerUp={handleTabsPointerUp}
            onScrollTabs={handleScrollTabs}
            selectedCategory={selectedCategory}
            tabsRef={tabsRef}
            t={t}
          />

          {loading && <FlashSaleLoadingState />}

          {!loading && (
            <>
              <ActiveFlashSales
                activeFlashSales={activeFlashSales}
                currentTime={currentTime}
                productCardProps={productCardProps}
                t={t}
              />

              <UpcomingFlashSales currentTime={currentTime} t={t} upcomingFlashSales={upcomingFlashSales} />

              {filteredFlashSales.length === 0 && <EmptyFlashSaleState t={t} />}

              {hasMoreFlashSales && <LoadMoreButton loadingMore={loadingMore} onLoadMore={handleLoadMore} t={t} />}
            </>
          )}

          <TrustHighlights t={t} />
        </section>
      </main>
    </div>
  )
}

export default FlashSale
