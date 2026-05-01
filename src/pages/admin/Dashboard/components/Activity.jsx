import React from 'react'
import { Avatar, Empty, Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { formatCurrency, getDashboardLocale } from '../utils/dashboardTransforms'

const STATUS_CONFIG = {
  completed: { labelKey: 'status.completed', className: 'success' },
  pending: { labelKey: 'status.pending', className: 'warning' },
  confirmed: { labelKey: 'status.confirmed', className: 'info' },
  processing: { labelKey: 'status.processing', className: 'info' },
  shipping: { labelKey: 'status.shipping', className: 'shipping' },
  cancelled: { labelKey: 'status.cancelled', className: 'danger' }
}

const extractClock = value => String(value || '').match(/\d{1,2}:\d{2}/)?.[0] || '--:--'

const getInitials = value => {
  const parts = String(value || '').trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] || 'K'
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || 'H'

  return `${first}${last}`.toUpperCase()
}

function CustomerList({ customers, loading, locale, t }) {
  if (loading) {
    return (
      <div className="dashboard-list">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton.Input key={index} active block className="dashboard-row-skeleton" />
        ))}
      </div>
    )
  }

  if (!customers.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('activity.emptyCustomers')} />
  }

  return (
    <div className="dashboard-list">
      {customers.map((user, index) => {
        const displayName = user.name || t('activity.fallbackCustomer')
        const formattedAmount = formatCurrency(user.total, locale)
        const formattedOrders = (Number(user.orders) || 0).toLocaleString(locale)

        return (
          <div className="dashboard-list-row dashboard-customer-row" key={user.key || `${displayName}-${index}`}>
            <Avatar src={user.avatar} size={38} className="dashboard-avatar">
              {getInitials(displayName)}
            </Avatar>
            <div className="dashboard-row-copy">
              <strong>{displayName}</strong>
              <span>{t('activity.customerOrders', { amount: formattedAmount, count: formattedOrders })}</span>
            </div>
            <span className="dashboard-status-badge success">{t('status.active')}</span>
          </div>
        )
      })}
    </div>
  )
}

function OrdersList({ loading, locale, orders, t }) {
  if (loading) {
    return (
      <div className="dashboard-list">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton.Input key={index} active block className="dashboard-row-skeleton" />
        ))}
      </div>
    )
  }

  if (!orders.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('activity.emptyOrders')} />
  }

  return (
    <div className="dashboard-list">
      {orders.slice(0, 5).map(order => {
        const statusConfig = STATUS_CONFIG[order.status]
        const status = statusConfig
          ? { label: t(statusConfig.labelKey), className: statusConfig.className }
          : { label: order.status || t('common.unknown'), className: 'neutral' }

        return (
          <div className="dashboard-list-row dashboard-order-row" key={order.id}>
            <span className="dashboard-square-icon">
              <ShoppingCart size={17} />
            </span>
            <strong className="dashboard-order-id">{order.id}</strong>
            <span className={`dashboard-status-badge ${status.className}`}>{status.label}</span>
            <span className="dashboard-order-amount">{formatCurrency(order.amount, locale)}</span>
            <span className="dashboard-order-time">{extractClock(order.time)}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function Activity({
  recentOrders,
  recentOrdersLoading,
  topCustomers,
  topCustomersLoading
}) {
  const { t, i18n } = useTranslation('adminDashboard')
  const locale = getDashboardLocale(i18n.language)
  const customers = (topCustomers || [])
    .filter(user => user && typeof user.totalSpent === 'number')
    .map((user, idx) => ({
      key: user._id || idx,
      avatar: user.avatarUrl,
      name: user.fullName || user.email,
      total: user.totalSpent,
      orders: user.totalOrders
    }))

  return (
    <section className="dashboard-bottom-grid dashboard-bottom-grid--half">
      <div className="dashboard-panel">
        <div className="dashboard-panel-header dashboard-panel-header--action">
          <h2>{t('activity.topCustomers')}</h2>
        </div>
        <CustomerList customers={customers} loading={topCustomersLoading} locale={locale} t={t} />
      </div>

      <div className="dashboard-panel">
        <div className="dashboard-panel-header dashboard-panel-header--action">
          <h2>{t('activity.recentOrders')}</h2>
          <Link to="/admin/orders">{t('common.viewAll')}</Link>
        </div>
        <OrdersList orders={recentOrders || []} loading={recentOrdersLoading} locale={locale} t={t} />
      </div>
    </section>
  )
}
