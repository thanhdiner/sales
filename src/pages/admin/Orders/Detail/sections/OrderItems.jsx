import { useTranslation } from 'react-i18next'
import {
  formatOrderDetailCurrency,
  getOrderDeliveryTypeLabel,
  getOrderItemFallbackIcon,
  getOrderItemKey,
  getOrderItemName,
  getOrderItemThumbnail
} from '../utils'

const FallbackIcon = getOrderItemFallbackIcon()

export default function OrderItems({ orderItems = [] }) {
  const { t, i18n } = useTranslation('adminOrderDetail')
  const language = i18n.resolvedLanguage || i18n.language

  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--admin-text)]">
        <FallbackIcon className="h-5 w-5 text-[var(--admin-text-muted)]" />
        {t('items.title')}
      </h2>

      <div className="space-y-3">
        {orderItems.map(item => {
          const thumbnail = getOrderItemThumbnail(item)
          const itemName = getOrderItemName(item, language, item.name || '')
          const deliveryTypeLabel = item.deliveryType ? getOrderDeliveryTypeLabel(item.deliveryType, t) : ''

          return (
            <div
              key={getOrderItemKey(item)}
              className="flex flex-col items-start justify-between gap-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-3 transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-3)] sm:flex-row sm:items-center sm:gap-4 sm:p-4"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
                  {thumbnail ? (
                    <img src={thumbnail} alt={itemName} className="h-full w-full object-cover" />
                  ) : (
                    <FallbackIcon className="h-6 w-6 text-[var(--admin-text-subtle)]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-sm font-medium text-[var(--admin-text)] sm:truncate">{itemName}</h3>
                  {item.category && <p className="mt-1 text-sm text-[var(--admin-text-muted)]">{item.category}</p>}
                  {deliveryTypeLabel && (
                    <p className="mt-1 text-xs font-medium text-[var(--admin-text-subtle)]">
                      {t('items.deliveryType', { type: deliveryTypeLabel })}
                    </p>
                  )}
                  {item.digitalDeliveries?.length > 0 && (
                    <div className="mt-2 rounded-lg border border-[color-mix(in_srgb,#22c55e_30%,var(--admin-border))] bg-[color-mix(in_srgb,#22c55e_12%,var(--admin-surface-2))] p-2 text-xs text-[#15803d] dark:text-[#4ade80]">
                      {t('items.deliveredCount', { count: item.digitalDeliveries.length })}
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0 text-left sm:text-right">
                <p className="text-sm font-medium text-[var(--admin-text)]">x{item.quantity}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--admin-text)]">
                  {formatOrderDetailCurrency(item.price, language)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
