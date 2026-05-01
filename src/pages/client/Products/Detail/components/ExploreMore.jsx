import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import '@/components/client/DailySuggestionsSection/DailySuggestionsSection.scss'
import HeroBannerCard from '@/components/client/DailySuggestionsSection/HeroBannerCard'
import ProductItem from '@/components/client/Products/ProductItem'
import { getExploreMoreProducts, getRecommendations } from '@/services/client/commerce/product'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import './ExploreMore.scss'

function normalizeProductsResponse(data) {
  if (Array.isArray(data)) {
    return data
  }

  const candidates = [data?.products, data?.data, data?.data?.products, data?.items, data?.data?.items]

  return candidates.find(Array.isArray) || []
}

function getPlainText(value = '') {
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function getFallbackProducts(productId) {
  const fallbackData = await getRecommendations({ tab: 'for-you', limit: 8 })

  return normalizeProductsResponse(fallbackData)
    .filter(item => item && String(item._id || item.id || '') !== String(productId))
    .slice(0, 8)
}

const EXPLORE_MORE_MODES = {
  SAME_CATEGORY: 'same-category',
  RECOMMENDED: 'recommended'
}

function getHeroBannerConfig(product, t) {
  const categoryTitle = product?.productCategory?.title || t('productDetail.exploreMore.fallbackCategory')
  const categorySlug = product?.productCategory?.slug
  const subtitle =
    getPlainText(product?.description).slice(0, 72) ||
    t('productDetail.exploreMore.fallbackSubtitle', {
      categoryTitle: categoryTitle.toLowerCase()
    })

  return {
    leftText: 'SMARTMALL',
    rightText: categoryTitle.toUpperCase(),
    title: product?.title || t('productDetail.exploreMore.fallbackTitle'),
    subtitle,
    imageUrl: product?.thumbnail,
    link: categorySlug ? `/product-categories/${categorySlug}` : '/products'
  }
}

function ExploreMore({ productId, product }) {
  const { t } = useTranslation('clientProducts')
  const language = useCurrentLanguage()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeMode, setActiveMode] = useState(EXPLORE_MORE_MODES.SAME_CATEGORY)
  const previousRequestKeyRef = useRef('')
  const heroBannerConfig = getHeroBannerConfig(product, t)

  useEffect(() => {
    if (!productId) {
      setProducts([])
      setLoading(false)
      return
    }

    let isCancelled = false
    const requestKey = `${language}:${productId}:${activeMode}`
    const requestChanged = previousRequestKeyRef.current !== requestKey
    previousRequestKeyRef.current = requestKey

    const fetchExploreMore = async () => {
      if (requestChanged) setProducts([])
      setLoading(true)

      try {
        const nextProducts =
          activeMode === EXPLORE_MORE_MODES.RECOMMENDED
            ? await getFallbackProducts(productId)
            : normalizeProductsResponse(await getExploreMoreProducts(productId, { limit: 8 }))

        const filteredProducts = nextProducts.filter(item => item && String(item._id || item.id || '') !== String(productId)).slice(0, 8)

        if (!isCancelled) {
          setProducts(filteredProducts)
        }
      } catch {
        try {
          const fallbackProducts = await getFallbackProducts(productId)

          if (!isCancelled) {
            setProducts(fallbackProducts)
          }
        } catch {
          if (!isCancelled) {
            setProducts([])
          }
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchExploreMore()

    return () => {
      isCancelled = true
    }
  }, [activeMode, language, productId])

  if (!productId) return null

  return (
    <section className="DailySuggestions-root ExploreMore-root">
      <div className="Suggestions-header-block">
        <div className="Suggestions-title">{t('productDetail.exploreMore.sectionTitle')}</div>

        <div className="ExploreMore-highlights">
          <button
            type="button"
            className={`ExploreMore-filter-button ${
              activeMode === EXPLORE_MORE_MODES.SAME_CATEGORY ? 'ExploreMore-filter-button--active' : ''
            }`}
            aria-pressed={activeMode === EXPLORE_MORE_MODES.SAME_CATEGORY}
            onClick={() => setActiveMode(EXPLORE_MORE_MODES.SAME_CATEGORY)}
          >
            {t('productDetail.exploreMore.sameCategory')}
          </button>

          <button
            type="button"
            className={`ExploreMore-filter-button ${
              activeMode === EXPLORE_MORE_MODES.RECOMMENDED ? 'ExploreMore-filter-button--active' : ''
            }`}
            aria-pressed={activeMode === EXPLORE_MORE_MODES.RECOMMENDED}
            onClick={() => setActiveMode(EXPLORE_MORE_MODES.RECOMMENDED)}
          >
            {t('productDetail.exploreMore.recommended')}
          </button>

          <span className="ExploreMore-count-badge" aria-live="polite">
            {loading
              ? t('productDetail.exploreMore.loadingProducts')
              : t('productDetail.exploreMore.featuredCount', {
                  count: products.length
                })}
          </span>
        </div>
      </div>

      <div className="Suggestions-grid">
        <HeroBannerCard config={heroBannerConfig} />

        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="ExploreMore-skeleton">
              <div className="ExploreMore-skeleton__image" />

              <div className="ExploreMore-skeleton__body">
                <div className="ExploreMore-skeleton__line" />
                <div className="ExploreMore-skeleton__line ExploreMore-skeleton__line--short" />
              </div>

              <div className="ExploreMore-skeleton__line ExploreMore-skeleton__line--price" />
            </div>
          ))
        ) : products.length > 0 ? (
          products.map((item, index) => (
            <div key={item._id || item.id || `explore-more-${index}`}>
              <ProductItem product={item} />
            </div>
          ))
        ) : (
          <div className="ExploreMore-empty">
            <div className="ExploreMore-empty__title">{t('productDetail.exploreMore.emptyTitle')}</div>

            <p className="ExploreMore-empty__description">{t('productDetail.exploreMore.emptyDescription')}</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ExploreMore
