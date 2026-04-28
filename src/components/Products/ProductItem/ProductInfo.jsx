import React from 'react'
import { useTranslation } from 'react-i18next'
import ProductRating from './ProductRating'
import ProductPrice from './ProductPrice'

export default function ProductInfo({ product, pricing }) {
  const { t } = useTranslation('clientProducts')
  const { discountVal, priceNew, price, savings } = pricing

  return (
    <div className="flex flex-1 flex-col gap-2 px-3 pb-3 pt-3 sm:gap-2.5 sm:px-4 sm:pb-4 sm:pt-3.5">
      <h3 className="min-h-[42px] text-[13px] font-semibold leading-5 text-slate-900 transition-colors duration-200 group-hover:text-blue-600 sm:min-h-[48px] sm:text-sm sm:leading-6 dark:text-[#f4f6f8] dark:group-hover:text-green-300">
        <span className="line-clamp-2">{product.title}</span>
      </h3>

      <ProductRating rate={product.rate} reviewCount={product.reviewCount ?? product.reviewsCount ?? product.totalReviews} />

      <div className="flex min-h-[28px] flex-wrap items-center gap-1.5 text-[10.5px] text-slate-500 sm:gap-2 sm:text-[11px] dark:text-[#a8b0ba]">
        <span className="rounded-full bg-slate-100/80 px-2 py-1 ring-1 ring-slate-200/70 dark:bg-[#202327] dark:ring-white/5 sm:px-2.5">
          {t('productItem.stockLeft')}{' '}
          <span className={product.stock === 0 ? 'font-semibold text-red-500' : 'font-semibold text-blue-600 dark:text-green-300'}>
            {product.stock}
          </span>
        </span>

        <span className="rounded-full bg-slate-50 px-2 py-1 text-slate-500 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-300 dark:ring-white/5 sm:px-2.5">
          {t('productItem.soldCount', { count: product.soldQuantity || 0 })}
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
