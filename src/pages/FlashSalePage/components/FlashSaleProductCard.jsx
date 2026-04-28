import { BarChart2, Heart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function FlashSaleProductCard({
  buyNowLoading,
  compareItems,
  formatCurrency,
  onBuyNow,
  onToggleCompare,
  onToggleWishlist,
  product,
  sale,
  t,
  wishlistItems,
  wishlistLoading
}) {
  const productId = product._id || product.id
  const salePrice = product.price * (1 - sale.discountPercent / 100)
  const savings = product.price - salePrice
  const inWishlist = wishlistItems.some(item => item.productId === productId)
  const inCompare = compareItems.some(item => item.productId === productId)
  const wishlistLabel = inWishlist ? t('product.removeWishlist') : t('product.addWishlist')

  return (
    <div className="h-full">
      <Link
        to={`/products/${product.slug}`}
        className="group block h-full"
        style={{ textDecoration: 'none', color: 'inherit' }}
        state={{
          flashSaleInfo: {
            salePrice: Math.round(product.price * (1 - sale.discountPercent / 100)),
            discountPercent: sale.discountPercent,
            flashSaleId: sale._id,
            endAt: sale.endAt
          }
        }}
      >
        <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-red-500/40">
          <div className="absolute left-2.5 top-2.5 z-20 flex flex-col items-start gap-1.5">
            <span className="rounded-md bg-red-600 px-2 py-0.5 text-xs font-black text-white shadow-sm">-{sale.discountPercent}%</span>

            {product.soldQuantity > 10 && (
              <span className="rounded-md bg-orange-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                {t('product.bestSeller')}
              </span>
            )}
          </div>

          <div className="absolute right-2.5 top-2.5 z-20 flex flex-col gap-1.5">
            <button
              onClick={event => onToggleWishlist(event, product, salePrice)}
              disabled={wishlistLoading[productId]}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm shadow-sm transition-all ${
                inWishlist
                  ? 'border-red-500 bg-red-500 text-white'
                  : 'border-slate-200 bg-white/95 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-400 dark:hover:bg-red-500/10'
              }`}
              title={wishlistLabel}
              aria-label={wishlistLabel}
            >
              {wishlistLoading[productId] ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Heart className={`h-4 w-4 ${inWishlist ? 'fill-white' : ''}`} />
              )}
            </button>

            <button
              onClick={event => onToggleCompare(event, product, sale, salePrice)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm shadow-sm transition-all ${
                inCompare
                  ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950'
                  : 'border-slate-200 bg-white/95 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
              title={t('product.compare')}
              aria-label={t('product.compare')}
            >
              <BarChart2 className="h-4 w-4" />
            </button>
          </div>

          <div className="bg-slate-50 p-2.5 dark:bg-slate-950">
            <div className="aspect-square overflow-hidden rounded-lg bg-white dark:bg-slate-900">
              <img src={product.thumbnail} alt={product.title} className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="flex flex-1 flex-col p-3">
            <h4 className="line-clamp-2 h-10 text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">{product.title}</h4>

            <div className="mt-2 flex h-4 items-center gap-1.5 overflow-hidden text-xs text-slate-500 dark:text-slate-400">
              <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
              <span className="truncate">{product.rating ? Number(product.rating).toFixed(1) : t('product.noRating')}</span>

              {product.soldQuantity > 0 && (
                <span className="shrink-0 whitespace-nowrap">â€¢ {t('product.sold', { count: product.soldQuantity })}</span>
              )}
            </div>

            <div className="mt-2 min-h-[48px]">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-lg font-black text-red-600 dark:text-red-400">{formatCurrency(salePrice)}</span>
                <span className="text-xs text-slate-400 line-through">{formatCurrency(product.price)}</span>
              </div>

              <p className="mt-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
                {t('product.saving', { amount: formatCurrency(savings) })}
              </p>
            </div>

            <div className="mt-2 mb-2 min-h-[30px] space-y-1.5">
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                  style={{
                    width: `${Math.min(100, Math.max(12, product.soldQuantity ? product.soldQuantity * 5 : 20))}%`
                  }}
                />
              </div>

              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="truncate">
                  {product.stock > 0 ? t('product.stockLeft', { count: product.stock }) : t('product.outOfStock')}
                </span>

                {product.deliveryEstimateDays > 0 && (
                  <span className="shrink-0 whitespace-nowrap">{t('product.delivery', { count: product.deliveryEstimateDays })}</span>
                )}
              </div>
            </div>

            <button
              className={`mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-sm font-bold text-white transition-all hover:bg-red-700 active:scale-[0.98] ${
                product.stock === 0 ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={product.stock === 0 || buyNowLoading[productId]}
              onClick={event => {
                event.preventDefault()
                event.stopPropagation()
                onBuyNow(product, sale)
              }}
            >
              {buyNowLoading[productId] && (
                <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}

              {product.stock === 0 ? t('product.outOfStock') : t('product.buyNow')}
            </button>
          </div>
        </article>
      </Link>
    </div>
  )
}
