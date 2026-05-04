import { Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { getOrderDetailStatusOptions, getOrderPaymentStatusOptions } from '../utils'

export default function OrderStatusUpdate({
  canRetryDigitalDelivery = false,
  hasStatusChanges,
  paymentStatus,
  status,
  updating,
  onPaymentStatusChange,
  onStatusChange,
  onUpdateStatus
}) {
  const { t } = useTranslation('adminOrderDetail')
  const buttonLabel = canRetryDigitalDelivery && !hasStatusChanges ? t('actions.completeDelivery') : t('actions.update')

  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)]">
      <div className="mb-3 text-sm font-semibold text-[var(--admin-text)]">{t('statusUpdate.title')}</div>
      <div className="grid gap-3">
        <Select
          value={status}
          onChange={onStatusChange}
          style={{ width: '100%', fontFamily: 'inherit' }}
          className="admin-order-detail-select w-full font-sans text-[var(--admin-text)]"
          options={getOrderDetailStatusOptions(t)}
        />

        <Select
          value={paymentStatus}
          onChange={onPaymentStatusChange}
          style={{ width: '100%', fontFamily: 'inherit' }}
          className="admin-order-detail-select w-full font-sans text-[var(--admin-text)]"
          options={getOrderPaymentStatusOptions(t)}
        />

        <button
          type="button"
          disabled={updating || (!canRetryDigitalDelivery && !hasStatusChanges)}
          onClick={onUpdateStatus}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-[var(--admin-accent)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
  )
}
