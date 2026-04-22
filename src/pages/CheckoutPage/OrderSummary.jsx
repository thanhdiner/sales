export function OrderSummary({ orderItems, subtotal, discount, shipping, total, formatPrice }) {
  return (
    <div className="sticky top-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Đơn hàng của bạn
        </h3>
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Kiểm tra lại sản phẩm và tổng tiền trước khi xác nhận.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        {orderItems.map(item => (
          <div key={item.id} className="flex gap-3">
            <div className="relative shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
              />

              <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                {item.quantity}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.name}
              </h4>

              {item.category && (
                <p className="mt-1 mb-0 text-xs text-gray-500 dark:text-gray-400">
                  {item.category}
                </p>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatPrice(item.price)}
                </span>

                {item.originalPrice > item.price && (
                  <span className="text-xs text-gray-400 line-through dark:text-gray-500">
                    {formatPrice(item.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
        <div className="flex justify-between gap-4 text-sm text-gray-600 dark:text-gray-300">
          <span>Tạm tính</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between gap-4 text-sm text-gray-600 dark:text-gray-300">
          <span>Giảm giá</span>
          <span>-{formatPrice(discount)}</span>
        </div>

        <div className="flex justify-between gap-4 text-sm text-gray-600 dark:text-gray-300">
          <span>Phí vận chuyển</span>
          <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
        </div>

        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex justify-between gap-4">
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Tổng cộng
            </span>

            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
        <div className="space-y-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          <p className="mb-0">Bảo hành chính hãng</p>
          <p className="mb-0">Nhận hàng tại cửa hàng</p>
          <p className="mb-0">Hỗ trợ khi cần</p>
        </div>
      </div>
    </div>
  )
}