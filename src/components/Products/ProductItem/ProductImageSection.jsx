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
    <div className="relative overflow-hidden bg-gray-50 aspect-square">
      <div className="w-full h-full">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="block w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
