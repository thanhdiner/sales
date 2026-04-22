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
  onOrderSuccess,
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
            discountPercent: item.discountPercent || item.discountPercentage || 0,
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
        promo: promo?.code || promo || '',
      }

      if (isOnlinePayment) {
        const pendingRes = await createPendingOrder(orderPayload)
        if (!pendingRes?.orderId) throw new Error('Không tạo được đơn hàng')

        setIsOrdered(true)
        message.loading('Đang chuyển đến cổng thanh toán…', 2)

        await redirectToPayment(paymentMethod, pendingRes.orderId)
        return
      }

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

  const selectedPayment = paymentMethods.find(method => method.id === paymentMethod)
  const selectedDelivery = deliveryOptions.find(option => option.id === deliveryMethod)

  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Xác nhận đơn hàng
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Kiểm tra lại thông tin trước khi gửi yêu cầu đặt hàng.
        </p>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Thông tin liên hệ
          </h3>

          <div className="mt-3 space-y-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
            <p className="mb-0">
              <span className="font-medium text-gray-900 dark:text-gray-100">Họ tên:</span>{' '}
              {formData.firstName} {formData.lastName}
            </p>

            <p className="mb-0">
              <span className="font-medium text-gray-900 dark:text-gray-100">Số điện thoại:</span>{' '}
              {formData.phone}
            </p>

            {formData.email && (
              <p className="mb-0">
                <span className="font-medium text-gray-900 dark:text-gray-100">Email:</span>{' '}
                {formData.email}
              </p>
            )}

            {formData.notes && (
              <p className="mb-0">
                <span className="font-medium text-gray-900 dark:text-gray-100">Ghi chú:</span>{' '}
                {formData.notes}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Phương thức thanh toán
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm leading-6 text-gray-600 dark:text-gray-300">
              {selectedPayment?.name}
            </span>

            {isOnlinePayment && (
              <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                Tự động chuyển hướng
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Cách thức nhận hàng
          </h3>

          <p className="mt-3 mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {selectedDelivery?.name}
            {selectedDelivery ? ` - ${selectedDelivery.time}` : ''}
          </p>
        </div>
      </div>

      {isOnlinePayment && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Bạn sẽ được chuyển đến trang thanh toán {selectedPayment?.name} sau khi xác nhận.
            Vui lòng không đóng trình duyệt trong quá trình thanh toán.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleConfirm}
        className="w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
        disabled={loading || isOrdered}
      >
        {loading
          ? isOnlinePayment
            ? 'Đang chuyển đến cổng thanh toán…'
            : 'Đang gửi...'
          : isOnlinePayment
            ? `Thanh toán qua ${selectedPayment?.name}`
            : deliveryMethod === 'contact'
              ? 'Gửi yêu cầu liên hệ'
              : 'Xác nhận đặt hàng'}
      </button>
    </div>
  )
}