import { getWishlistDiscountPercentage } from '../utils/wishlistPageUtils'

function WishlistPriceCell({ className = '', formatPrice, item }) {
  const price = Number(item.price || 0)
  const originalPrice = Number(item.originalPrice || 0)
  const discountPct = getWishlistDiscountPercentage(item)

  return (
    <div className={className}>
      <p className="text-base font-extrabold leading-6 text-[#ff424e] dark:text-red-300">{formatPrice(price)}</p>

      {discountPct > 0 && originalPrice > price && (
        <p className="mt-0.5 text-sm font-medium text-slate-400 line-through dark:text-gray-500">
          {formatPrice(originalPrice)}
        </p>
      )}
    </div>
  )
}

export default WishlistPriceCell
