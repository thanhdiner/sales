import { Typography } from 'antd'
import { Clock, KeyRound, Link as LinkIcon, LockKeyhole, Mail, PackageCheck, ShieldCheck, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatAdminOrderDetailDate, getAdminOrderItemName } from '../utils'

const FIELD_CONFIG = [
  { key: 'username', labelKey: 'digitalDelivery.fields.username', Icon: UserRound },
  { key: 'password', labelKey: 'digitalDelivery.fields.password', Icon: LockKeyhole },
  { key: 'email', labelKey: 'digitalDelivery.fields.email', Icon: Mail },
  { key: 'licenseKey', labelKey: 'digitalDelivery.fields.licenseKey', Icon: KeyRound },
  { key: 'loginUrl', labelKey: 'digitalDelivery.fields.loginUrl', Icon: LinkIcon, isLink: true },
  { key: 'instructions', labelKey: 'digitalDelivery.fields.instructions', Icon: ShieldCheck, multiline: true },
  { key: 'notes', labelKey: 'digitalDelivery.fields.notes', Icon: ShieldCheck, multiline: true }
]

const getDigitalDeliveries = (orderItems, language) =>
  (orderItems || [])
    .flatMap(item => (item.digitalDeliveries || []).map((delivery, index) => ({
      ...delivery,
      productName: getAdminOrderItemName(item, language, item.name || ''),
      index: index + 1
    })))
    .filter(delivery => FIELD_CONFIG.some(field => delivery[field.key]))

const getPendingInstantItems = orderItems =>
  (orderItems || []).filter(item => item.deliveryType === 'instant_account' && !item.digitalDeliveries?.length)

const DeliveryField = ({ field, value, t }) => {
  const Icon = field.Icon
  const content = field.isLink ? (
    <a href={value} target="_blank" rel="noreferrer" className="break-all text-[var(--admin-accent)] transition-opacity hover:opacity-90">
      {value}
    </a>
  ) : (
    <Typography.Paragraph className="mb-0 break-all text-[var(--admin-text)]" copyable>
      {String(value)}
    </Typography.Paragraph>
  )

  return (
    <div className={`rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-3 ${field.multiline ? 'sm:col-span-2' : ''}`}>
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase text-[var(--admin-text-muted)]">
        <Icon className="h-4 w-4" />
        {t(field.labelKey)}
      </div>
      <div className={`text-sm ${field.multiline ? 'whitespace-pre-wrap' : ''}`}>{content}</div>
    </div>
  )
}

export default function AdminOrderDigitalDeliverySection({ orderItems = [], paymentStatus }) {
  const { t, i18n } = useTranslation('adminOrderDetail')
  const language = i18n.resolvedLanguage || i18n.language
  const deliveries = getDigitalDeliveries(orderItems, language)
  const pendingInstantItems = getPendingInstantItems(orderItems)

  if (!deliveries.length && !pendingInstantItems.length) {
    return null
  }

  return (
    <section className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--admin-text)]">
        <PackageCheck className="h-5 w-5 text-[var(--admin-accent)]" />
        {t('digitalDelivery.title')}
      </h2>

      {pendingInstantItems.length > 0 && (
        <div className="mb-4 rounded-lg border border-[color-mix(in_srgb,#f59e0b_30%,var(--admin-border))] bg-[color-mix(in_srgb,#f59e0b_12%,var(--admin-surface-2))] p-3 text-sm text-[#b45309] dark:text-[#fbbf24]">
          <div className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="mb-1 font-semibold">
                {paymentStatus === 'paid' ? t('digitalDelivery.pendingPaid') : t('digitalDelivery.pendingPayment')}
              </p>
              <p className="mb-0">
                {pendingInstantItems.map(item => getAdminOrderItemName(item, language, item.name || '')).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {deliveries.length > 0 && (
        <div className="space-y-4">
          {deliveries.map((delivery, deliveryIndex) => (
            <div key={`${delivery.credentialId || deliveryIndex}`} className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 sm:p-4">
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="break-words text-sm font-semibold text-[var(--admin-text)]">
                  {delivery.productName} {delivery.index ? `#${delivery.index}` : ''}
                </h3>
                {delivery.deliveredAt && (
                  <span className="text-xs text-[var(--admin-text-muted)]">
                    {formatAdminOrderDetailDate(delivery.deliveredAt, language)}
                  </span>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {FIELD_CONFIG.filter(field => delivery[field.key]).map(field => (
                  <DeliveryField key={field.key} field={field} value={delivery[field.key]} t={t} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
