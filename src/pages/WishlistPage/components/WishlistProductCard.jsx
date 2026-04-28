import { Link } from 'react-router-dom'
import { getWishlistDiscountPercentage, getWishlistItemName } from '../utils/wishlistPageUtils'
import WishlistActionsCell from './WishlistActionsCell'
import WishlistPriceCell from './WishlistPriceCell'
import WishlistStockBadge from './WishlistStockBadge'

function WishlistProductCard({ addingToCart, formatPrice, item, language, onAddToCart, onRemove, t }) {
  const discountPct = getWishlistDiscountPercentage(item)
  const productName = getWishlistItemName(item, language)
  const productPath = item.slug ? `/products/${item.slug}` : '/products'

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex gap-3">
        <Link
          to={productPath}
          className="relative h-[88px] w-[88px] flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-gray-700 dark:bg-gray-900"
        >
          <img src={item.image} alt={productName} className="h-full w-full object-contain" />
        </Link>

        <div className="min-w-0 flex-1">
          <Link to={productPath}>
            <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-950 transition-colors hover:text-[#0b74e5] dark:text-gray-100 dark:hover:text-blue-300">
              {productName}
            </h3>
          </Link>

          {discountPct > 0 && (
            <span className="mt-2 inline-flex rounded-md bg-[#ff424e] px-2 py-1 text-xs font-extrabold leading-none text-white">
              -{discountPct}%
            </span>
          )}
        </div>
      </div>

      <WishlistPriceCell className="mt-4" formatPrice={formatPrice} item={item} />

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-gray-700">
        <span className="text-sm font-semibold text-slate-500 dark:text-gray-400">{t('table.stockStatus')}:</span>
        <WishlistStockBadge item={item} t={t} />
      </div>

      <WishlistActionsCell
        addingToCart={addingToCart}
        item={item}
        onAddToCart={onAddToCart}
        onRemove={onRemove}
        t={t}
        variant="mobile"
      />
    </article>
  )
}

export default WishlistProductCard
