import { Clock, RotateCcw, Shield, Truck } from 'lucide-react'
import { formatPromotionDate } from '../helpers'

const supportCards = [
  { icon: Shield, title: 'Bảo hành', description: 'Trọn gói' },
  { icon: Truck, title: 'Giao hàng', description: 'Miễn phí' },
  { icon: RotateCcw, title: 'Hỗ trợ', description: 'Tư vấn 24/7' }
]

function ProductInfoSections({ product, features }) {
  return (
    <>
      {features.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">Tính năng nổi bật</h3>

          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {supportCards.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <Icon className="mx-auto mb-2 h-6 w-6 text-gray-600 dark:text-gray-300" />
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        ))}
      </div>

      {product.timeStart && product.timeFinish && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Clock className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span className="font-semibold">Thời gian khuyến mãi</span>
          </div>

          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Từ {formatPromotionDate(product.timeStart)}
            {' đến '}
            {formatPromotionDate(product.timeFinish)}
          </div>
        </div>
      )}

      {product.description && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">Mô tả sản phẩm</h3>
          <div className="leading-7 text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      )}

      {product.content && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">Chi tiết sản phẩm</h3>
          <div
            className="prose prose-sm max-w-none text-gray-700 dark:prose-invert dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: product.content }}
          />
        </div>
      )}
    </>
  )
}

export default ProductInfoSections
