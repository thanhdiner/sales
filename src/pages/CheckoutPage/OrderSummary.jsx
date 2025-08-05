import { Package, Phone, Shield } from 'lucide-react'

export function OrderSummary({ orderItems, subtotal, discount, shipping, total, formatPrice }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Đơn hàng của bạn</h3>

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
              <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
              <p className="text-xs text-gray-500">{item.category}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-bold text-gray-800">{formatPrice(item.price)}</span>
                {item.originalPrice > item.price && (
                  <span className="text-xs text-gray-400 line-through">{formatPrice(item.originalPrice)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Giảm giá</span>
          <span>-{formatPrice(discount)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển</span>
          <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between text-xl font-bold text-gray-800">
            <span>Tổng cộng</span>
            <span className="text-blue-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Bảo hành chính hãng</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Package className="w-4 h-4 text-blue-500" />
          <span>Nhận hàng tại cửa hàng</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Phone className="w-4 h-4 text-green-500" />
          <span>Hỗ trợ 24/7</span>
        </div>
      </div>
    </div>
  )
}
