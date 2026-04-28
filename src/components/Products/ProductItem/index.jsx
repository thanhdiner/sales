import React from 'react'
import { Link } from 'react-router-dom'
import { useProductActions } from '@/hooks/useProductActions'
import { getProductPricing, getProductRibbon } from '@/helpers/productItemHelpers'
import ProductImageSection from './ProductImageSection'
import ProductInfo from './ProductInfo'
import AddToCartButton from './AddToCartButton'

function ProductItem({ product, isDragging }) {
  const actions = useProductActions(product)
  const pricing = getProductPricing(product)
  const ribbon = getProductRibbon(pricing.discountVal)

  const handleProductClick = event => {
    if (isDragging) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const content = (
    <div className="group relative flex flex-1 flex-col overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_38px_rgba(15,23,42,0.1)] sm:rounded-[20px] dark:border-white/10 dark:bg-[#111315] dark:hover:border-white/15 dark:hover:shadow-[0_18px_38px_rgba(0,0,0,0.38)]">
      <Link
        to={`/products/${product.slug}`}
        state={{
          fromFlashSale: true,
          flashSaleInfo: {
            flashSaleId: product.flashSaleId,
            salePrice: product.salePrice,
            discountPercent: product.discountPercent,
            endAt: product.endAt
          }
        }}
        draggable={false}
        onClick={handleProductClick}
        className="flex flex-1 flex-col"
      >
        <ProductImageSection
          product={product}
          discountLabel={ribbon.text}
          isInWishlist={actions.isInWishlist}
          wishlistLoading={actions.wishlistLoading}
          handleToggleWishlist={actions.handleToggleWishlist}
          isInCompare={actions.isInCompare}
          handleToggleCompare={actions.handleToggleCompare}
        />

        <ProductInfo product={product} pricing={pricing} />
      </Link>

      <AddToCartButton
        loading={actions.addCartLoading}
        outOfStock={product.stock === 0}
        onClick={actions.handleAddToCart}
      />
    </div>
  )

  return (
    <div className="product mt-1 flex h-full min-w-0 flex-col">
      <div className="flex flex-1 flex-col w-full">{content}</div>
    </div>
  )
}

export default ProductItem
