import {
  formatAdminOrderDetailCurrency,
  getAdminOrderItemFallbackIcon,
  getAdminOrderItemKey,
  getAdminOrderItemThumbnail
} from '../utils'

const FallbackIcon = getAdminOrderItemFallbackIcon()

export default function AdminOrderItemsSection({ orderItems = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
        <FallbackIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        Sản phẩm đã đặt
      </h2>

      <div className="space-y-3">
        {orderItems.map(item => {
          const thumbnail = getAdminOrderItemThumbnail(item)

          return (
            <div
              key={getAdminOrderItemKey(item)}
              className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                  {thumbnail ? (
                    <img src={thumbnail} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <FallbackIcon className="h-6 w-6 text-gray-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">{item.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">x{item.quantity}</p>
                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {formatAdminOrderDetailCurrency(item.price)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
