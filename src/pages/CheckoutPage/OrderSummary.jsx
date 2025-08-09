import { Package, Phone, Shield } from 'lucide-react'

export function OrderSummary({ orderItems, subtotal, discount, shipping, total, formatPrice }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
      <h3 className="text-lg font-bold text-gray-800 mb-6 dark:text-gray-100">Đơn hàng của bạn</h3>

      <div className="space-y-4 mb-6">
        {orderItems.map(item => (
          <div key={item.id} className="flex gap-3">
            <div className="relative">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 text-sm dark:text-gray-100">{item.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-bold text-gray-800 dark:text-gray-100">{formatPrice(item.price)}</span>
                {item.originalPrice > item.price && (
                  <span className="text-xs text-gray-400 line-through dark:text-gray-400">{formatPrice(item.originalPrice)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span className="dark:text-gray-300">Tạm tính</span>
          <span className="dark:text-gray-300">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span className="dark:text-gray-300">Giảm giá</span>
          <span className="dark:text-gray-300">-{formatPrice(discount)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span className="dark:text-gray-300">Phí vận chuyển</span>
          <span className="dark:text-gray-300">{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between text-xl font-bold text-gray-800">
            <span className="dark:text-gray-300">Tổng cộng</span>
            <span className="text-blue-600 dark:text-gray-300">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="dark:text-gray-300">Bảo hành chính hãng</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Package className="w-4 h-4 text-blue-500" />
          <span className="dark:text-gray-300">Nhận hàng tại cửa hàng</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Phone className="w-4 h-4 text-green-500" />
          <span className="dark:text-gray-300">Hỗ trợ 24/7</span>
        </div>
      </div>
    </div>
  )
}
