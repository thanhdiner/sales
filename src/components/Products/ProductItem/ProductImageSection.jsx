import React from 'react'
import ProductActionsOverlay from './ProductActionsOverlay'

export default function ProductImageSection({
  product,
  isInWishlist,
  wishlistLoading,
  handleToggleWishlist,
  isInCompare,
  handleToggleCompare
}) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-b-[16px] bg-[radial-gradient(circle_at_top,_rgba(219,234,254,0.95),_rgba(248,250,252,0.95)_55%,_rgba(255,255,255,0.98)_100%)] p-3 dark:bg-[radial-gradient(circle_at_top,_rgba(32,35,39,0.95),_rgba(21,23,25,0.98)_58%,_rgba(16,18,19,1)_100%)]">
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[12px] border border-white/80 bg-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:border-transparent dark:bg-[#101213]/80 dark:shadow-none">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="block h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/10 via-transparent to-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-black/30 dark:to-transparent" />

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
