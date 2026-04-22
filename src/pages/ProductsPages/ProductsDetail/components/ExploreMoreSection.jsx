import { useEffect, useState } from 'react'
import '@/components/DailySuggestionsSession/DailySuggestionsSession.scss'
import HeroBannerCard from '@/components/DailySuggestionsSession/HeroBannerCard'
import ProductItem from '@/components/Products/ProductItem'
import { getExploreMoreProducts, getRecommendations } from '@/services/productService'
import './ExploreMoreSection.scss'

function normalizeProductsResponse(data) {
  if (Array.isArray(data)) {
    return data
  }

  const candidates = [
    data?.products,
    data?.data,
    data?.data?.products,
    data?.items,
    data?.data?.items
  ]

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

function getHeroBannerConfig(product) {
  const categoryTitle = product?.productCategory?.title || 'Khám phá'
  const categorySlug = product?.productCategory?.slug
  const subtitle =
    getPlainText(product?.description).slice(0, 72) ||
    `Thêm nhiều lựa chọn nổi bật trong danh mục ${categoryTitle.toLowerCase()}.`

  return {
    leftText: 'SMARTMALL',
    rightText: categoryTitle.toUpperCase(),
    title: product?.title || 'Khám phá thêm',
    subtitle,
    imageUrl: product?.thumbnail,
    link: categorySlug ? `/product-categories/${categorySlug}` : '/products'
  }
}

function ExploreMoreSection({ productId, product }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const heroBannerConfig = getHeroBannerConfig(product)

  useEffect(() => {
    if (!productId) {
      setProducts([])
      setLoading(false)
      return
    }

    let isCancelled = false

    const fetchExploreMore = async () => {
      setLoading(true)

      try {
        const data = await getExploreMoreProducts(productId, { limit: 8 })
        let nextProducts = normalizeProductsResponse(data)

        if (nextProducts.length === 0) {
          nextProducts = await getFallbackProducts(productId)
        }

        const filteredProducts = nextProducts
          .filter(item => item && String(item._id || item.id || '') !== String(productId))
          .slice(0, 8)

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
  }, [productId])

  if (!productId) return null

  return (
    <section className="DailySuggestions-root ExploreMoreSection-root">
      <div className="Suggestions-header-block">
        <div className="Suggestions-title">Khám phá thêm</div>

        <div className="ExploreMoreSection-highlights">
          <div className="ExploreMoreSection-chip ExploreMoreSection-chip--primary">Cùng danh mục</div>
          <div className="ExploreMoreSection-chip">Gợi ý dành cho bạn</div>
          <div className="ExploreMoreSection-chip">
            {loading ? 'Đang tải sản phẩm' : `${products.length} sản phẩm nổi bật`}
          </div>
        </div>
      </div>

      <div className="Suggestions-grid">
        <HeroBannerCard config={heroBannerConfig} />

        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="ExploreMoreSection-skeleton">
              <div className="ExploreMoreSection-skeleton__image" />

              <div className="ExploreMoreSection-skeleton__body">
                <div className="ExploreMoreSection-skeleton__line" />
                <div className="ExploreMoreSection-skeleton__line ExploreMoreSection-skeleton__line--short" />
              </div>

              <div className="ExploreMoreSection-skeleton__line ExploreMoreSection-skeleton__line--price" />
            </div>
          ))
        ) : products.length > 0 ? (
          products.map((item, index) => (
            <div key={item._id || item.id || `explore-more-${index}`}>
              <ProductItem product={item} />
            </div>
          ))
        ) : (
          <div className="ExploreMoreSection-empty">
            <div className="ExploreMoreSection-empty__title">
              Chưa có thêm sản phẩm gợi ý ở thời điểm này.
            </div>

            <p className="ExploreMoreSection-empty__description">
              Bạn có thể bấm vào thẻ bên trái để khám phá thêm sản phẩm cùng danh mục.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ExploreMoreSection
