import { Bell, Heart, Minus, Plus, ShoppingCart, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function LoadingIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

function ProductPurchasePanel({
  quantity,
  maxAvailable,
  addCartLoading,
  buyNowLoading,
  notifyLoading = false,
  isOutOfStock = false,
  onQuantityChange,
  onQuantityBlur,
  onDecrease,
  onIncrease,
  onAddToCart,
  onBuyNow,
  onNotifyWhenBackInStock,
  isLiked,
  onToggleLike
}) {
  const { t } = useTranslation('clientProducts')

  return (
    <section className="product-detail-card product-detail-purchase">
      <div className="product-detail-purchase__quantity">
        <span>{t('productDetail.purchasePanel.quantity')}</span>

        <div className="product-detail-qty-control">
          <button
            type="button"
            onClick={onDecrease}
            aria-label={t('productDetail.purchasePanel.decreaseQuantity')}
            title={t('productDetail.purchasePanel.decreaseQuantity')}
            disabled={+quantity <= 1 || maxAvailable <= 0}
          >
            <Minus size={16} />
          </button>

          <input
            type="number"
            className="qtyInput"
            value={quantity}
            onChange={onQuantityChange}
            onBlur={onQuantityBlur}
            min={1}
            max={maxAvailable}
            disabled={maxAvailable <= 0}
            aria-label={t('productDetail.purchasePanel.quantity')}
          />

          <button
            type="button"
            onClick={onIncrease}
            aria-label={t('productDetail.purchasePanel.increaseQuantity')}
            title={t('productDetail.purchasePanel.increaseQuantity')}
            disabled={maxAvailable <= 0 || +quantity >= maxAvailable}
          >
            <Plus size={16} />
          </button>
        </div>

        {maxAvailable !== null && maxAvailable <= 0 && (
          <small>
            {isOutOfStock
              ? t('productDetail.purchasePanel.outOfStockHint')
              : t('productDetail.purchasePanel.maxAdded')}
          </small>
        )}
      </div>

      <div className="product-detail-actions">
        {isOutOfStock ? (
          <button
            type="button"
            className="product-detail-action product-detail-action--notify"
            onClick={onNotifyWhenBackInStock}
            disabled={notifyLoading}
          >
            {notifyLoading ? <LoadingIcon className="h-4 w-4 animate-spin" /> : <Bell size={17} />}
            <span>{t('productDetail.purchasePanel.notifyWhenBackInStock')}</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              className="product-detail-action product-detail-action--cart"
              onClick={onAddToCart}
              disabled={addCartLoading || maxAvailable <= 0}
            >
              {addCartLoading ? <LoadingIcon className="h-4 w-4 animate-spin" /> : <ShoppingCart size={17} />}
              <span>{t('productDetail.purchasePanel.addToCart')}</span>
            </button>

            <button
              type="button"
              className="product-detail-action product-detail-action--buy"
              onClick={onBuyNow}
              disabled={buyNowLoading || maxAvailable <= 0}
            >
              {buyNowLoading ? <LoadingIcon className="h-4 w-4 animate-spin" /> : <Zap size={17} />}
              <span>{t('productDetail.purchasePanel.buyNow')}</span>
            </button>
          </>
        )}

        <button type="button" className="product-detail-action product-detail-action--wishlist" onClick={onToggleLike}>
          <Heart size={17} className={isLiked ? 'fill-current' : ''} />
          <span>{isLiked ? t('productDetail.purchasePanel.removeFromWishlist') : t('productDetail.purchasePanel.addToWishlist')}</span>
        </button>
      </div>
    </section>
  )
}

export default ProductPurchasePanel
