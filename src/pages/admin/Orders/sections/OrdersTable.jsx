import { Calendar, Eye, Package, Phone, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  formatOrderDate,
  formatOrderTotal,
  getOrderCode,
  getOrderCustomerName,
  getOrderItemsSummary,
  getOrderPaymentMethodLabel,
  getOrderPaymentStatusLabel,
  getOrderStatusConfig
} from '../utils'

function OrdersLoadingState() {
  const { t } = useTranslation('adminOrders')

  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--admin-border)] border-t-[var(--admin-accent)]" />
        <p className="text-sm font-medium text-[var(--admin-text-muted)]">{t('table.loading')}</p>
      </div>
    </div>
  )
}

function OrdersEmptyState() {
  const { t } = useTranslation('adminOrders')

  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[var(--admin-text-subtle)]">
          <Package className="h-6 w-6" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-[var(--admin-text)]">{t('table.emptyTitle')}</h3>
        <p className="text-sm text-[var(--admin-text-muted)]">{t('table.emptyDescription')}</p>
      </div>
    </div>
  )
}

function OrdersDesktopRow({ order, onViewOrder }) {
  const { t, i18n } = useTranslation('adminOrders')
  const language = i18n.resolvedLanguage || i18n.language
  const statusConfig = getOrderStatusConfig(order.status, t)
  const StatusIcon = statusConfig.icon
  const customerName = getOrderCustomerName(order, t('table.guestCustomer'))
  const itemsSummary = getOrderItemsSummary(order, language, t)
  const paymentMeta = [
    order.paymentStatus ? getOrderPaymentStatusLabel(order.paymentStatus, t) : '',
    order.paymentMethod ? getOrderPaymentMethodLabel(order.paymentMethod, t) : ''
  ].filter(Boolean).join(' · ')

  return (
    <div
      className="group hidden cursor-pointer grid-cols-12 items-center gap-4 px-5 py-3 transition-colors hover:bg-[var(--admin-surface-2)] xl:grid"
      onClick={() => onViewOrder(order._id)}
    >
      <div className="col-span-2">
        <div className="inline-flex rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--admin-text)]">
          {getOrderCode(order._id)}
        </div>
      </div>

      <div className="col-span-2 min-w-0">
        <div className="truncate text-sm font-medium text-[var(--admin-text)]">{customerName}</div>
        {itemsSummary && <div className="mt-1 truncate text-xs text-[var(--admin-text-subtle)]">{itemsSummary}</div>}
      </div>
      <div className="col-span-2 break-words text-sm text-[var(--admin-text-muted)]">{order.contact?.phone || '--'}</div>
      <div className="col-span-2 text-sm text-[var(--admin-text-muted)]">{formatOrderDate(order.createdAt, language)}</div>

      <div className="col-span-2">
        <div className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${statusConfig.badgeClassName}`}>
          <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.iconClassName}`} />
          {statusConfig.label}
        </div>
      </div>

      <div className="col-span-1">
        <div className="text-sm font-semibold text-[var(--admin-text)]">{formatOrderTotal(order.total, language)}</div>
        {paymentMeta && <div className="mt-1 text-xs font-medium text-[var(--admin-text-muted)]">{paymentMeta}</div>}
      </div>

      <div className="col-span-1 text-center">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)] transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]"
          onClick={event => {
            event.stopPropagation()
            onViewOrder(order._id)
          }}
          aria-label={t('table.viewOrderDetails')}
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function OrdersTabletRow({ order, onViewOrder }) {
  const { t, i18n } = useTranslation('adminOrders')
  const language = i18n.resolvedLanguage || i18n.language
  const statusConfig = getOrderStatusConfig(order.status, t)
  const StatusIcon = statusConfig.icon
  const customerName = getOrderCustomerName(order, t('table.guestCustomer'))
  const itemsSummary = getOrderItemsSummary(order, language, t)
  const paymentMeta = [
    order.paymentStatus ? getOrderPaymentStatusLabel(order.paymentStatus, t) : '',
    order.paymentMethod ? getOrderPaymentMethodLabel(order.paymentMethod, t) : ''
  ].filter(Boolean).join(' · ')

  return (
    <div
      className="group hidden cursor-pointer rounded-xl border border-transparent px-4 py-3.5 transition-colors hover:border-[var(--admin-border)] hover:bg-[var(--admin-surface-2)] md:block xl:hidden"
      onClick={() => onViewOrder(order._id)}
    >
      <div className="grid grid-cols-12 items-center gap-3">
        <div className="col-span-3 min-w-0">
          <div className="truncate text-[15px] font-semibold leading-5 text-[var(--admin-text)]">{customerName}</div>
          {itemsSummary && <div className="mt-1 truncate text-xs text-[var(--admin-text-subtle)]">{itemsSummary}</div>}
        </div>

        <div className="col-span-3">
          <div className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${statusConfig.badgeClassName}`}>
            <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.iconClassName}`} />
            {statusConfig.label}
          </div>
        </div>

        <div className="col-span-3">
          <div className="text-base font-semibold text-[var(--admin-text)]">{formatOrderTotal(order.total, language)}</div>
          {paymentMeta && <div className="mt-1 text-xs font-medium text-[var(--admin-text-muted)]">{paymentMeta}</div>}
        </div>

        <div className="col-span-3 flex justify-end">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)] transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]"
            onClick={event => {
              event.stopPropagation()
              onViewOrder(order._id)
            }}
            aria-label={t('table.viewOrderDetails')}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--admin-text-muted)]">
        <span className="inline-flex items-center gap-1">
          <Tag className="h-3.5 w-3.5" />
          {getOrderCode(order._id)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Phone className="h-3.5 w-3.5" />
          {order.contact?.phone || '--'}
        </span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatOrderDate(order.createdAt, language)}
        </span>
      </div>
    </div>
  )
}

function OrdersMobileCard({ order, onViewOrder }) {
  const { t, i18n } = useTranslation('adminOrders')
  const language = i18n.resolvedLanguage || i18n.language
  const statusConfig = getOrderStatusConfig(order.status, t)
  const StatusIcon = statusConfig.icon
  const customerName = getOrderCustomerName(order, t('table.guestCustomer'))
  const itemsSummary = getOrderItemsSummary(order, language, t)
  const paymentMeta = [
    order.paymentStatus ? getOrderPaymentStatusLabel(order.paymentStatus, t) : '',
    order.paymentMethod ? getOrderPaymentMethodLabel(order.paymentMethod, t) : ''
  ].filter(Boolean).join(' · ')

  return (
    <article className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3.5 shadow-[var(--admin-shadow)] md:hidden">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[17px] font-semibold leading-6 text-[var(--admin-text)]">{customerName}</h3>
          <p className="mt-1 font-mono text-xs text-[var(--admin-text-subtle)]">{getOrderCode(order._id)}</p>
          {itemsSummary && <p className="mt-1 line-clamp-2 text-sm text-[var(--admin-text-muted)]">{itemsSummary}</p>}
        </div>

        <div className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${statusConfig.badgeClassName}`}>
          <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.iconClassName}`} />
          {statusConfig.label}
        </div>
      </div>

      <p className="mb-1 text-[30px] font-semibold leading-8 text-[var(--admin-text)]">{formatOrderTotal(order.total, language)}</p>
      {paymentMeta && <p className="mb-3 text-sm font-medium text-[var(--admin-text-muted)]">{paymentMeta}</p>}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--admin-text-muted)]">
        <p className="inline-flex items-center gap-2 whitespace-nowrap">
          <Calendar className="h-4 w-4" />
          {formatOrderDate(order.createdAt, language)}
        </p>
        <p className="inline-flex items-center gap-2.5 whitespace-nowrap">
          <Phone className="h-4 w-4" />
          {order.contact?.phone || '--'}
        </p>
      </div>

      <button
        type="button"
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--admin-accent)] bg-[color-mix(in_srgb,var(--admin-accent)_14%,var(--admin-surface))] px-4 py-2.5 text-sm font-semibold text-[var(--admin-accent)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--admin-accent)_22%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--admin-accent)_20%,var(--admin-surface))]"
        onClick={() => onViewOrder(order._id)}
      >
        <Eye className="h-4 w-4" />
        {t('table.viewDetails')}
      </button>
    </article>
  )
}

export default function OrdersTable({ loading, orders, onViewOrder }) {
  const { t } = useTranslation('adminOrders')

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)] sm:rounded-xl">
      {loading ? (
        <OrdersLoadingState />
      ) : orders.length === 0 ? (
        <OrdersEmptyState />
      ) : (
        <>
          <div className="hidden border-b border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-5 py-3 xl:block">
            <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">
              <div className="col-span-2">{t('table.columns.orderCode')}</div>
              <div className="col-span-2">{t('table.columns.customer')}</div>
              <div className="col-span-2">{t('table.columns.contact')}</div>
              <div className="col-span-2">{t('table.columns.createdAt')}</div>
              <div className="col-span-2">{t('table.columns.status')}</div>
              <div className="col-span-1">{t('table.columns.total')}</div>
              <div className="col-span-1 text-center">{t('table.columns.actions')}</div>
            </div>
          </div>

          <div className="hidden border-b border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)] md:block xl:hidden">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-3">{t('table.columns.customer')}</div>
              <div className="col-span-3">{t('table.columns.status')}</div>
              <div className="col-span-3">{t('table.columns.total')}</div>
              <div className="col-span-3 text-right">{t('table.columns.actions')}</div>
            </div>
          </div>

          <div className="divide-y divide-[var(--admin-border)]">
            {orders.map(order => (
              <div key={order._id} className="px-2 py-2 sm:px-3 md:px-0 md:py-0">
                <OrdersDesktopRow order={order} onViewOrder={onViewOrder} />
                <OrdersTabletRow order={order} onViewOrder={onViewOrder} />
                <OrdersMobileCard order={order} onViewOrder={onViewOrder} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
