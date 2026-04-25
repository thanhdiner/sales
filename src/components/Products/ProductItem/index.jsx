import React from 'react'
import { Badge } from 'antd'
import { Link } from 'react-router-dom'
import { useProductActions } from '@/hooks/useProductActions'
import { getProductPricing, getProductRibbon } from '@/helpers/productItemHelpers'
import ProductBadges from './ProductBadges'
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
    <div className="group relative flex flex-1 flex-col overflow-hidden rounded-[16px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.92)_100%)] shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-[0_24px_55px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-[linear-gradient(180deg,#101213_0%,#151719_100%)] dark:hover:border-white/15 dark:hover:shadow-[0_22px_48px_rgba(0,0,0,0.42)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-50/80 to-transparent opacity-80 dark:from-green-500/10" />
      <ProductBadges product={product} />

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
    <div className="product mt-1 flex h-full flex-col">
      {ribbon.text ? (
        <Badge.Ribbon
          placement="start"
          color={ribbon.color}
          text={ribbon.text}
          rootClassName="flex flex-1 flex-col w-full"
        >
          {content}
        </Badge.Ribbon>
      ) : (
        <div className="flex flex-1 flex-col w-full">{content}</div>
      )}
    </div>
  )
}

export default ProductItem
