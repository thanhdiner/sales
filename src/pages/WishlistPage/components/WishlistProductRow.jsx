import { Link } from 'react-router-dom'
import { getWishlistDiscountPercentage, getWishlistItemName } from '../utils/wishlistPageUtils'
import WishlistActionsCell from './WishlistActionsCell'
import WishlistPriceCell from './WishlistPriceCell'
import WishlistStockBadge from './WishlistStockBadge'

function WishlistProductRow({ addingToCart, formatPrice, item, language, onAddToCart, onRemove, t }) {
  const discountPct = getWishlistDiscountPercentage(item)
  const productName = getWishlistItemName(item, language)
  const productPath = item.slug ? `/products/${item.slug}` : '/products'

  return (
    <div className="grid min-h-[96px] grid-cols-[minmax(0,1fr)_160px_140px_170px] items-center gap-4 px-5 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-gray-700/40">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to={productPath}
          className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-gray-700 dark:bg-gray-900"
        >
          <img src={item.image} alt={productName} className="h-full w-full object-contain transition-transform duration-500 hover:scale-105" />
        </Link>

        <div className="min-w-0">
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

      <WishlistPriceCell formatPrice={formatPrice} item={item} />

      <WishlistStockBadge item={item} t={t} />

      <WishlistActionsCell
        addingToCart={addingToCart}
        item={item}
        onAddToCart={onAddToCart}
        onRemove={onRemove}
        t={t}
      />
    </div>
  )
}

export default WishlistProductRow
