import { Award, Eye, Star } from 'lucide-react'
import { formatPrice } from '../helpers'

function ProductSummaryPanel({ product, priceNew, priceOrigin, discountPercent, savings }) {
  const rating = Number(product.rate) || 0

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {product.isTopDeal && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <Award className="h-3.5 w-3.5" />
              Top Deal
            </span>
          )}

          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <Star className="h-3.5 w-3.5" />
              Nổi bật
            </span>
          )}

          {product.productCategory && (
            <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {product.productCategory.title}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-semibold leading-tight text-gray-900 dark:text-gray-100 md:text-3xl">{product.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${index < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
              />
            ))}

            {rating > 0 ? (
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">({rating}/5)</span>
            ) : (
              <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">Chưa có đánh giá</span>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Eye className="h-4 w-4" />
            <span>Còn {product.stock} sản phẩm</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-semibold text-gray-900 dark:text-gray-100">{formatPrice(priceNew)}</span>

          {discountPercent > 0 && priceOrigin > 0 && <span className="text-base text-gray-400 line-through">{formatPrice(priceOrigin)}</span>}
        </div>

        {savings > 0 && priceOrigin > 0 && (
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">Tiết kiệm {formatPrice(savings)}</p>
        )}
      </div>
    </>
  )
}

export default ProductSummaryPanel
