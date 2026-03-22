import { CheckCircle, ExternalLink } from 'lucide-react'
import { createOrder } from '@/services/ordersService'
import { createPendingOrder, redirectToPayment } from '@/services/paymentService'
import { useState } from 'react'
import { message } from 'antd'

const ONLINE_METHODS = ['vnpay', 'momo', 'zalopay']

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

  const isOnlinePayment = ONLINE_METHODS.includes(paymentMethod)

  const handleConfirm = async () => {
    if (loading) return
    setLoading(true)
    try {
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

      const orderPayload = {
        contact: formData,
        orderItems: itemsWithFlashSale,
        deliveryMethod,
        paymentMethod,
        subtotal,
        discount,
        shipping,
        total,
        promo: promo?.code || promo || ''
      }

      // ─── Thanh toán trực tuyến (VNPay / MoMo / ZaloPay) ───────────────
      if (isOnlinePayment) {
        // 1. Tạo đơn pending trước
        const pendingRes = await createPendingOrder(orderPayload)
        if (!pendingRes?.orderId) throw new Error('Không tạo được đơn hàng')

        setIsOrdered(true)
        message.loading('Đang chuyển đến cổng thanh toán…', 2)

        // 2. Redirect sang cổng thanh toán (không return — tab sẽ chuyển trang)
        await redirectToPayment(paymentMethod, pendingRes.orderId)
        return
      }

      // ─── Thanh toán thủ công (transfer / contact) ─────────────────────
      const res = await createOrder(orderPayload)
      if (res && res.success) {
        setIsOrdered(true)
        message.success('Đặt hàng thành công!')
        if (onOrderSuccess) onOrderSuccess(res.order)
      } else {
        message.error(res.error || 'Có lỗi xảy ra!')
      }
    } catch (err) {
      message.error(err.message || 'Có lỗi xảy ra!')
    } finally {
      setLoading(false)
    }
  }

  const selectedPayment = paymentMethods.find(m => m.id === paymentMethod)
  const selectedDelivery = deliveryOptions.find(s => s.id === deliveryMethod)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-gray-100">Xác nhận đơn hàng</h2>
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-xl dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
          <h3 className="font-semibold text-blue-800 mb-2 dark:text-gray-100">👤 Thông tin liên hệ</h3>
          <p className="text-blue-700 dark:text-gray-300">{formData.firstName} {formData.lastName}</p>
          <p className="text-blue-700 dark:text-gray-300">📱 {formData.phone}</p>
          {formData.email && <p className="text-blue-700 dark:text-gray-300">📧 {formData.email}</p>}
          {formData.notes && <p className="text-blue-700 text-sm mt-2 dark:text-gray-300">📝 {formData.notes}</p>}
        </div>

        <div className="p-4 bg-green-50 rounded-xl dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
          <h3 className="font-semibold text-green-800 mb-2 dark:text-gray-100">💳 Phương thức thanh toán</h3>
          <div className="flex items-center gap-2">
            <span className="text-green-700 dark:text-gray-300">{selectedPayment?.name}</span>
            {isOnlinePayment && (
              <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> Tự động chuyển hướng
              </span>
            )}
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-xl dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
          <h3 className="font-semibold text-purple-800 mb-2 dark:text-gray-100">📦 Cách thức nhận hàng</h3>
          <p className="text-purple-700 dark:text-gray-300">
            {selectedDelivery?.name}{selectedDelivery ? ` - ${selectedDelivery.time}` : ''}
          </p>
        </div>
      </div>

      {isOnlinePayment && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
          <ExternalLink className="w-4 h-4 mt-0.5 shrink-0" />
          <span>Bạn sẽ được chuyển đến trang thanh toán <strong>{selectedPayment?.name}</strong> sau khi xác nhận. Vui lòng không đóng trình duyệt.</span>
        </div>
      )}

      <button
        onClick={handleConfirm}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        disabled={loading || isOrdered}
      >
        {isOnlinePayment ? <ExternalLink className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
        {loading
          ? (isOnlinePayment ? 'Đang chuyển đến cổng thanh toán…' : 'Đang gửi...')
          : isOnlinePayment
            ? `Thanh toán qua ${selectedPayment?.name}`
            : deliveryMethod === 'contact' ? 'Gửi yêu cầu liên hệ' : 'Xác nhận đặt hàng'
        }
      </button>
    </div>
  )
}
