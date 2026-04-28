import { useTranslation } from 'react-i18next'
import {
  formatAdminOrderDetailCurrency,
  getAdminOrderDeliveryMethodLabel,
  getAdminOrderPaymentMethodLabel,
  getAdminOrderPaymentStatusLabel
} from '../utils'

export default function AdminOrderSummarySection({ order }) {
  const { t, i18n } = useTranslation('adminOrderDetail')
  const language = i18n.resolvedLanguage || i18n.language

  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
      <h2 className="mb-4 text-base font-semibold text-[var(--admin-text)]">{t('summary.title')}</h2>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4 text-sm text-[var(--admin-text-muted)]">
          <span>{t('summary.payment')}</span>
          <span>{getAdminOrderPaymentStatusLabel(order.paymentStatus, t)}</span>
        </div>

        {order.paymentMethod && (
          <div className="flex items-start justify-between gap-4 text-sm text-[var(--admin-text-muted)]">
            <span>{t('summary.paymentMethod')}</span>
            <span>{getAdminOrderPaymentMethodLabel(order.paymentMethod, t)}</span>
          </div>
        )}

        {order.deliveryMethod && (
          <div className="flex items-start justify-between gap-4 text-sm text-[var(--admin-text-muted)]">
            <span>{t('summary.deliveryMethod')}</span>
            <span>{getAdminOrderDeliveryMethodLabel(order.deliveryMethod, t)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm text-[var(--admin-text-muted)]">
          <span>{t('summary.subtotal')}</span>
          <span>{formatAdminOrderDetailCurrency(order.subtotal, language)}</span>
        </div>

        {order.discount > 0 && (
          <div className="flex items-start justify-between gap-4 text-sm text-[#16a34a] dark:text-[#4ade80]">
            <span>{t('summary.discount')}</span>
            <span>-{formatAdminOrderDetailCurrency(order.discount, language)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm text-[var(--admin-text-muted)]">
          <span>{t('summary.shipping')}</span>
          <span>{order.shipping === 0 ? t('summary.freeShipping') : formatAdminOrderDetailCurrency(order.shipping, language)}</span>
        </div>

        <div className="border-t border-[var(--admin-border)] pt-3">
          <div className="flex items-start justify-between gap-4 text-base font-semibold text-[var(--admin-text)]">
            <span>{t('summary.total')}</span>
            <span>{formatAdminOrderDetailCurrency(order.total, language)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
