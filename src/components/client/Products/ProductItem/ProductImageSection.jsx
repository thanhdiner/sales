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
  const discountPercent = discountLabel ? String(discountLabel).match(/\d+%/)?.[0] : ''
  const sketchDiscountLabel = discountPercent ? `Giảm ${discountPercent}` : discountLabel
  return (
    <div className="relative h-[142px] overflow-hidden border-b border-slate-100 bg-slate-50 p-2 sm:h-[166px] sm:p-3 xl:h-[176px] dark:border-white/10 dark:bg-[#17191c]">
      {discountLabel ? (
        <div className="pointer-events-none absolute left-0 top-0 z-20 h-[45px] w-[106px] sm:left-1 sm:top-1">
          <svg width="106" height="45" viewBox="0 0 152 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
              d="M28 13C50 10 76 12 104 13C118 14 127 21 126 32C125 44 116 52 101 53C71 55 47 53 27 51C15 50 9 42 10 31C11 20 16 14 28 13Z"
              fill="#E8232E"
              stroke="#C81E28"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M30 16C51 14 76 15 102 16"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.22"
            />
            <path
              d="M20 7L22 13L28 15L22 17L20 23L18 17L12 15L18 13L20 7Z"
              fill="#FFD166"
            />
            <path
              d="M124 7L126 12L131 14L126 16L124 21L122 16L117 14L122 12L124 7Z"
              fill="white"
              opacity="0.9"
            />
            <text
              x="28"
              y="37"
              fontFamily="Comic Sans MS, Segoe Print, cursive"
              fontSize="15"
              fontWeight="800"
              fill="white"
              transform="rotate(-1 28 37)"
            >
              {sketchDiscountLabel}
            </text>
          </svg>
          <span className="sr-only">{sketchDiscountLabel}</span>
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
