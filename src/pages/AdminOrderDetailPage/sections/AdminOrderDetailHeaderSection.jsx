import { Select } from 'antd'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  getAdminOrderDetailCode,
  getAdminOrderDetailStatusInfo,
  getAdminOrderDetailStatusOptions,
  getAdminOrderPaymentStatusOptions
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
  const { t } = useTranslation('adminOrderDetail')
  const statusInfo = getAdminOrderDetailStatusInfo(order.status, t)
  const StatusIcon = statusInfo.icon
  const hasStatusChanges = status !== order.status || paymentStatus !== order.paymentStatus
  const buttonLabel = canRetryDigitalDelivery && !hasStatusChanges ? t('actions.completeDelivery') : t('actions.update')

  return (
    <div className="mb-4 sm:mb-5">
      <button
        type="button"
        className="mb-3 inline-flex items-center gap-2 break-words text-left text-sm font-medium text-[var(--admin-text-muted)] transition-colors hover:text-[var(--admin-text)] sm:mb-4"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        {t('actions.backToOrders')}
      </button>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--admin-text)] sm:text-2xl">
            {t('page.orderTitle', { code: getAdminOrderDetailCode(order._id) })}
          </h1>

          <div
            className={`mt-3 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${statusInfo.color}`}
          >
            <StatusIcon className="h-4 w-4" />
            {statusInfo.label}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 shadow-[var(--admin-shadow)] sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Select
              value={status}
              onChange={onStatusChange}
              style={{ width: '100%', fontFamily: 'inherit' }}
              className="admin-order-detail-select w-full font-sans text-[var(--admin-text)] sm:min-w-[180px] sm:w-auto"
              options={getAdminOrderDetailStatusOptions(t)}
            />

            <Select
              value={paymentStatus}
              onChange={onPaymentStatusChange}
              style={{ width: '100%', fontFamily: 'inherit' }}
              className="admin-order-detail-select w-full font-sans text-[var(--admin-text)] sm:min-w-[180px] sm:w-auto"
              options={getAdminOrderPaymentStatusOptions(t)}
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
                  {t('actions.saving')}
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
