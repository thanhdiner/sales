import { isWishlistItemInStock } from '../utils/wishlistPageUtils'

function WishlistStockBadge({ item, t }) {
  const inStock = isWishlistItemInStock(item)

  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-lg px-3 text-xs font-bold ${
        inStock
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
          : 'bg-red-50 text-[#ff424e] dark:bg-red-500/10 dark:text-red-300'
      }`}
    >
      {inStock ? t('item.inStockBadge') : t('item.outOfStockBadge')}
    </span>
  )
}

export default WishlistStockBadge
