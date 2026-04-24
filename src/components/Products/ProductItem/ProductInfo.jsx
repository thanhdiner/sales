import React from 'react'
import ProductRating from './ProductRating'
import ProductPrice from './ProductPrice'

export default function ProductInfo({ product, pricing }) {
  const { discountVal, priceNew, price, savings } = pricing

  return (
    <div className="flex flex-1 flex-col space-y-3 px-4 pb-4 pt-3">
      <h3
        className="text-sm font-semibold leading-6 text-slate-900 transition-colors duration-200 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-300"
        style={{ minHeight: '48px' }}
      >
        <span className="line-clamp-2">{product.title}</span>
      </h3>

      <ProductRating rate={product.rate} />

      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800/90">
          Còn lại{' '}
          <span className={product.stock === 0 ? 'font-semibold text-red-500' : 'font-semibold text-blue-600 dark:text-blue-300'}>
            {product.stock}
          </span>
        </span>
        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
          Đã bán {product.soldQuantity || 0}
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
