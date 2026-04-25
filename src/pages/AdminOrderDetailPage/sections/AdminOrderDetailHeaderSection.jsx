import { Select } from 'antd'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import {
  ADMIN_ORDER_DETAIL_STATUS_OPTIONS,
  ADMIN_ORDER_PAYMENT_STATUS_OPTIONS,
  getAdminOrderDetailCode,
  getAdminOrderDetailStatusInfo
} from '../utils'

export default function AdminOrderDetailHeaderSection({
  order,
  status,
  paymentStatus,
  updating,
  successMessage,
  canRetryDigitalDelivery = false,
  onBack,
  onStatusChange,
  onPaymentStatusChange,
  onUpdateStatus
}) {
  const statusInfo = getAdminOrderDetailStatusInfo(order.status)
  const StatusIcon = statusInfo.icon
  const hasStatusChanges = status !== order.status || paymentStatus !== order.paymentStatus
  const buttonLabel = canRetryDigitalDelivery && !hasStatusChanges ? 'Chốt bàn giao' : 'Cập nhật'

  return (
    <div className="mb-5">
      <button
        type="button"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--admin-text-muted)] transition-colors hover:text-[var(--admin-text)]"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách đơn hàng
      </button>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--admin-text)]">
            Đơn hàng {getAdminOrderDetailCode(order._id)}
          </h1>

          <div
            className={`mt-3 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${statusInfo.color}`}
          >
            <StatusIcon className="h-4 w-4" />
            {statusInfo.label}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              value={status}
              onChange={onStatusChange}
              style={{ minWidth: 180, fontFamily: 'inherit' }}
              className="admin-order-detail-select font-sans text-[var(--admin-text)]"
              options={ADMIN_ORDER_DETAIL_STATUS_OPTIONS}
            />

            <Select
              value={paymentStatus}
              onChange={onPaymentStatusChange}
              style={{ minWidth: 180, fontFamily: 'inherit' }}
              className="admin-order-detail-select font-sans text-[var(--admin-text)]"
              options={ADMIN_ORDER_PAYMENT_STATUS_OPTIONS}
            />

            <button
              type="button"
              disabled={updating || (!canRetryDigitalDelivery && !hasStatusChanges)}
              onClick={onUpdateStatus}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-[var(--admin-accent)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Đang lưu...
                </>
              ) : (
                buttonLabel
              )}
            </button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="mt-4 rounded-xl border border-[color-mix(in_srgb,#22c55e_30%,var(--admin-border))] bg-[color-mix(in_srgb,#22c55e_14%,var(--admin-surface-2))] p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-[#16a34a] dark:text-[#4ade80]" />
            <span className="text-sm font-medium text-[#15803d] dark:text-[#4ade80]">{successMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}
