import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getOrderDetailCode, getOrderDetailStatusInfo } from '../utils'

export default function Header({ order, successMessage, onBack }) {
  const { t } = useTranslation('adminOrderDetail')
  const statusInfo = getOrderDetailStatusInfo(order.status, t)
  const StatusIcon = statusInfo.icon

  return (
    <div className="mb-3">
      <button
        type="button"
        className="mb-3 inline-flex items-center gap-2 break-words text-left text-sm font-medium text-[var(--admin-text-muted)] transition-colors hover:text-[var(--admin-text)]"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        {t('actions.backToOrders')}
      </button>

      <h1 className="text-xl font-semibold text-[var(--admin-text)] sm:text-2xl">
        {t('page.orderTitle', { code: getOrderDetailCode(order._id) })}
      </h1>

      <div className={`mt-2 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${statusInfo.color}`}>
        <StatusIcon className="h-4 w-4" />
        {statusInfo.label}
      </div>

      {successMessage && (
        <div className="mt-3 rounded-xl border border-[color-mix(in_srgb,#22c55e_30%,var(--admin-border))] bg-[color-mix(in_srgb,#22c55e_14%,var(--admin-surface-2))] p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-[#16a34a] dark:text-[#4ade80]" />
            <span className="text-sm font-medium text-[#15803d] dark:text-[#4ade80]">{successMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}
