import { CheckCircle } from 'lucide-react'
import { createOrder } from '@/services/ordersService'
import { useState } from 'react'
import { message } from 'antd'

export function ReviewOrder({
  formData,
  paymentMethod,
  paymentMethods,
  deliveryMethod,
  deliveryOptions,
  orderItems,
  subtotal,
  discount,
  shipping,
  total,
  promo,
  onOrderSuccess
}) {
  const [loading, setLoading] = useState(false)
  const [isOrdered, setIsOrdered] = useState(false)

  const handleConfirm = async () => {
    if (loading) return
    setLoading(true)
    try {
      // Đảm bảo các field flash sale (nếu có) được truyền vào từng item
      const itemsWithFlashSale = orderItems.map(item => {
        if (item.isFlashSale && item.flashSaleId && item.salePrice !== undefined) {
          return {
            ...item,
            isFlashSale: true,
            flashSaleId: item.flashSaleId,
            salePrice: item.salePrice,
            discountPercent: item.discountPercent || item.discountPercentage || 0
          }
        }
        return item
      })

      const res = await createOrder({
        contact: formData,
        orderItems: itemsWithFlashSale,
        deliveryMethod,
        paymentMethod,
        subtotal,
        discount,
        shipping,
        total,
        promo: promo?.code || promo || ''
      })
      if (res && res.success) {
        setIsOrdered(true)
        message.success('Đặt hàng thành công! Vui lòng đến cửa hàng để nhận hàng.')
        if (onOrderSuccess) onOrderSuccess(res.order)
        return
      } else {
        message.error(res.error || 'Có lỗi xảy ra!')
      }
    } catch (err) {
      message.error(err.message || 'Có lỗi xảy ra!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Xác nhận đơn hàng</h2>
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-xl">
          <h3 className="font-semibold text-blue-800 mb-2">👤 Thông tin liên hệ</h3>
          <p className="text-blue-700">
            {formData.firstName} {formData.lastName}
          </p>
          <p className="text-blue-700">📱 {formData.phone}</p>
          {formData.email && <p className="text-blue-700">📧 {formData.email}</p>}
          {formData.notes && <p className="text-blue-700 text-sm mt-2">📝 {formData.notes}</p>}
        </div>
        <div className="p-4 bg-green-50 rounded-xl">
          <h3 className="font-semibold text-green-800 mb-2">💳 Phương thức thanh toán</h3>
          <p className="text-green-700">{paymentMethods.find(m => m.id === paymentMethod)?.name}</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-xl">
          <h3 className="font-semibold text-purple-800 mb-2">📦 Cách thức nhận hàng</h3>
          <p className="text-purple-700">
            {deliveryOptions.find(s => s.id === deliveryMethod)?.name}
            {' -'}
            {deliveryOptions.find(s => s.id === deliveryMethod)?.time}
          </p>
        </div>
      </div>
      <button
        onClick={handleConfirm}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        disabled={loading || isOrdered}
      >
        <CheckCircle className="w-5 h-5" />
        {loading ? 'Đang gửi...' : deliveryMethod === 'contact' ? 'Gửi yêu cầu liên hệ' : 'Xác nhận đặt hàng'}
      </button>
    </div>
  )
}
