import React from 'react'
import { formatOrderPrice, getOrderStatusText } from '../utils'

const hasDigitalDeliveries = order => (order.orderItems || []).some(item => item.digitalDeliveries?.length > 0)

const getPrimaryAction = order => {
  if (order.paymentStatus === 'failed' || order.status === 'cancelled') {
    return {
      label: 'Liên hệ hỗ trợ',
      disabled: false,
      action: 'support',
      helperText: 'Đơn đang ở trạng thái cần hỗ trợ. Hãy liên hệ shop để kiểm tra lại thông tin thanh toán hoặc bàn giao.',
    }
  }

  if (order.paymentStatus === 'paid' && hasDigitalDeliveries(order)) {
    return {
      label: 'Xem thông tin tài khoản',
      disabled: false,
      action: 'account',
      helperText: 'Tài khoản/license đã sẵn sàng. Bạn có thể xem và sao chép trực tiếp trong đơn này.',
    }
  }

  return {
    label: 'Đang chờ bàn giao',
    disabled: true,
    action: 'pending',
    helperText: 'Shop đang xử lý đơn. Thông tin tài khoản sẽ xuất hiện ngay sau khi bàn giao.',
  }
}

const OrderSummaryCard = ({ order, canCancel, cancelling, onCancelOrder, onOpenAccountInfo, onContactSupport }) => {
  const primaryAction = getPrimaryAction(order)
  const showSupportButton = primaryAction.action !== 'support'

  const handlePrimaryAction = () => {
    if (primaryAction.action === 'account') {
      onOpenAccountInfo()
      return
    }

    if (primaryAction.action === 'support') {
      onContactSupport()
    }
  }

  return (
    <div className="sticky top-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Tóm tắt đơn hàng</h2>

      <div className="mt-5 space-y-3 border-b border-gray-200 pb-4 dark:border-gray-700">
        <div className="flex justify-between gap-4 text-sm text-gray-600 dark:text-gray-300">
          <span>Tạm tính</span>
          <span>{formatOrderPrice(order.subtotal)}</span>
        </div>

        {order.discount > 0 && (
          <div className="flex justify-between gap-4 text-sm text-gray-600 dark:text-gray-300">
            <span>Giảm giá</span>
            <span>-{formatOrderPrice(order.discount)}</span>
          </div>
        )}

        <div className="flex justify-between gap-4 text-sm text-gray-600 dark:text-gray-300">
          <span>Phương thức nhận</span>
          <span>Tài khoản số</span>
        </div>

        <div className="flex justify-between gap-4 text-sm text-gray-600 dark:text-gray-300">
          <span>Trạng thái xử lý</span>
          <span>{getOrderStatusText(order.status)}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between gap-4">
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">Tổng cộng</span>
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{formatOrderPrice(order.total)}</span>
      </div>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          className="w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
          disabled={primaryAction.disabled}
          onClick={handlePrimaryAction}
        >
          {primaryAction.label}
        </button>

        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">{primaryAction.helperText}</p>

        {showSupportButton && (
          <button
            type="button"
            className="w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            onClick={onContactSupport}
          >
            Liên hệ hỗ trợ
          </button>
        )}

        {canCancel && (
          <button
            type="button"
            className="w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            onClick={onCancelOrder}
            disabled={cancelling}
          >
            {cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
          </button>
        )}
      </div>
    </div>
  )
}

export default OrderSummaryCard
