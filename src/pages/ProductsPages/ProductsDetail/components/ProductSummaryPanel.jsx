import { Award, CheckCircle2, PackageCheck, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatPrice, getPlainText, getProductReviewCount, getProductSoldCount } from '../helpers'

function ProductSummaryPanel({ product, priceNew, priceOrigin, discountPercent, savings, onOpenReviews }) {
  const { t, i18n } = useTranslation('clientProducts')
  const rating = Number(product.rate) || 0
  const reviewCount = getProductReviewCount(product)
  const soldCount = getProductSoldCount(product)
  const shortDescription = getPlainText(product.description).slice(0, 220)
  const inStock = Number(product.stock) > 0

  return (
    <section className="product-detail-card product-detail-summary">
      <div>
        <div className="product-detail-tag-row">
          {product.isTopDeal && (
            <span className="product-detail-tag">
              <Award className="h-3.5 w-3.5" />
              {t('productDetail.summaryPanel.topDeal')}
            </span>
          )}

          {product.isFeatured && (
            <span className="product-detail-tag">
              <Star className="h-3.5 w-3.5" />
              {t('productDetail.summaryPanel.featured')}
            </span>
          )}

          {product.productCategory && (
            <span className="product-detail-tag">
              {product.productCategory.title}
            </span>
          )}
        </div>

        <h1 className="product-detail-title">{product.title}</h1>

        <div className="product-detail-rating-row">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${index < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
              />
            ))}

            <span className="ml-1 text-gray-600 dark:text-gray-400">
              {rating > 0 ? rating.toFixed(1) : t('productDetail.summaryPanel.noRating')}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenReviews}
            className="product-detail-link-button"
          >
            {t('productDetail.summaryPanel.reviewCount', { count: reviewCount })}
          </button>

          <span className="product-detail-meta-divider">|</span>

          <span>{t('productDetail.summaryPanel.soldCount', { count: soldCount })}</span>
        </div>
      </div>

      <div className="product-detail-price-block">
        <div className="flex flex-wrap items-center gap-3">
          <span className="product-detail-price-current">{formatPrice(priceNew, i18n.language)}</span>

          {discountPercent > 0 && priceOrigin > 0 && (
            <span className="product-detail-price-old">{formatPrice(priceOrigin, i18n.language)}</span>
          )}

          {discountPercent > 0 && (
            <span className="product-detail-discount-badge">
              -{discountPercent}%
            </span>
          )}
        </div>

        {savings > 0 && priceOrigin > 0 && (
          <p className="product-detail-saving-text">
            {t('productDetail.summaryPanel.saving', {
              amount: formatPrice(savings, i18n.language)
            })}
          </p>
        )}
      </div>

      <div className={`product-detail-stock ${inStock ? 'product-detail-stock--available' : 'product-detail-stock--out'}`}>
        {inStock ? <CheckCircle2 size={18} /> : <PackageCheck size={18} />}
        <span>
          {inStock
            ? t('productDetail.summaryPanel.inStockWithCount', { count: product.stock })
            : t('productDetail.summaryPanel.outOfStock')}
        </span>
      </div>

      {shortDescription && <p className="product-detail-short-description">{shortDescription}</p>}
    </section>
  )
}

export default ProductSummaryPanel
