import React from 'react'
import ProductRating from './ProductRating'
import ProductPrice from './ProductPrice'

export default function ProductInfo({ product, pricing }) {
  const { discountVal, priceNew, price, savings } = pricing

  return (
    <div className="p-3 space-y-1 flex-1 flex flex-col">
      <h3
        className="dark:text-gray-300 font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors duration-200"
        style={{ minHeight: '38px' }}
      >
        {product.title}
      </h3>
      
      <ProductRating rate={product.rate} />

      <div className="flex items-center gap-3 mt-1">
        <span className="text-xs text-gray-500">
          <b>Còn lại:</b> <span className={product.stock === 0 ? 'text-red-600' : 'text-blue-600'}>{product.stock}</span>
        </span>
        <span className="text-xs text-gray-500">
          <b>Đã bán:</b> <span className="text-orange-600">{product.soldQuantity || 0}</span>
        </span>
      </div>
      
      <ProductPrice 
        priceNew={priceNew} 
        price={price} 
        discountVal={discountVal} 
        savings={savings} 
        deliveryEstimateDays={product.deliveryEstimateDays} 
      />
    </div>
  )
}
