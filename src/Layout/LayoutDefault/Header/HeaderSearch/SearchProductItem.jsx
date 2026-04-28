import { Package, Star } from 'lucide-react'
import { formatVND } from '@/helpers/formatCurrency'

function getDisplayPrice(product) {
  const priceNew = Number(product?.priceNew)
  if (Number.isFinite(priceNew) && priceNew > 0) return priceNew

  const price = Number(product?.price || 0)
  const discount = Number(product?.discountPercentage || 0)
  return Math.round((price * (100 - discount)) / 100)
}

export default function SearchProductItem({ product, active, onSelect, onHover }) {
  const displayPrice = getDisplayPrice(product)

  return (
    <button
      type="button"
      className={`header-search-product${active ? ' header-search-product--active' : ''}`}
      onMouseDown={event => {
        event.preventDefault()
        onSelect(product)
      }}
      onMouseEnter={onHover}
      role="option"
      aria-selected={active}
    >
      <span className="header-search-product__media">
        {product.thumbnail ? (
          <img src={product.thumbnail} alt={product.title} loading="lazy" />
        ) : (
          <Package size={20} />
        )}
      </span>

      <span className="header-search-product__body">
        <span className="header-search-product__title">{product.title}</span>
        <span className="header-search-product__meta">
          <span className="header-search-product__price">{formatVND(displayPrice, { withSuffix: true })}</span>
          {Number(product.rate) > 0 && (
            <span className="header-search-product__rating">
              <Star size={12} fill="currentColor" />
              {Number(product.rate).toFixed(1)}
            </span>
          )}
        </span>
      </span>

      {Number(product.discountPercentage) > 0 && (
        <span className="header-search-product__discount">-{product.discountPercentage}%</span>
      )}
    </button>
  )
}
