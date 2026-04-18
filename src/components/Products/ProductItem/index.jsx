import React from 'react'
import { Badge } from 'antd'
import { Link } from 'react-router-dom'
import { useProductActions } from '../../../hooks/useProductActions'
import { getProductPricing, getProductRibbon } from '../../../helpers/productItemHelpers'
import ProductBadges from './ProductBadges'
import ProductImageSection from './ProductImageSection'
import ProductInfo from './ProductInfo'
import AddToCartButton from './AddToCartButton'

function ProductItem({ product, isDragging }) {
  const actions = useProductActions(product)
  const pricing = getProductPricing(product)
  const ribbon = getProductRibbon(pricing.discountVal)

  const content = (
    <div className="group relative bg-white rounded-2xl overflow-hidden hover:border-blue-500 transition-colors duration-300 border border-solid border-gray-200 flex flex-col flex-1 dark:bg-gray-800">
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
        className="flex-1 flex flex-col"
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
    <div className="product mt-1 flex flex-col h-full">
      {ribbon.text ? (
        <Badge.Ribbon placement="start" color={ribbon.color} text={ribbon.text} rootClassName="flex-1 flex flex-col w-full">
          {content}
        </Badge.Ribbon>
      ) : (
        <div className="flex-1 flex flex-col w-full">{content}</div>
      )}
    </div>
  )
}

export default ProductItem
