import React from 'react'
import ProductActionsOverlay from './ProductActionsOverlay'
import ProductBadges from './ProductBadges'

export default function ProductImageSection({
  product,
  discountLabel,
  isInWishlist,
  wishlistLoading,
  handleToggleWishlist,
  isInCompare,
  handleToggleCompare
}) {
  return (
    <div className="relative h-[156px] overflow-hidden border-b border-slate-100 bg-slate-50 p-2 sm:h-[190px] sm:p-3 xl:h-[200px] dark:border-white/10 dark:bg-[#17191c]">
      {discountLabel ? (
        <div className="pointer-events-none absolute left-2 top-2 z-20 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-semibold leading-none text-white shadow-sm sm:left-3 sm:top-3 sm:text-xs">
          {discountLabel}
        </div>
      ) : null}

      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[14px] bg-white/85 dark:bg-[#101213]">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="block h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03] sm:p-4"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/5 via-transparent to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-black/20 dark:to-transparent" />

      <ProductBadges product={product} />

      <ProductActionsOverlay
        isInWishlist={isInWishlist}
        wishlistLoading={wishlistLoading}
        handleToggleWishlist={handleToggleWishlist}
        isInCompare={isInCompare}
        handleToggleCompare={handleToggleCompare}
      />
    </div>
  )
}
