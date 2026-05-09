import React from 'react'
import { Avatar, Dropdown, Empty, Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MoreHorizontal, ShoppingCart } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
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

export function DashboardRowSkeleton({ rows = 5, compact = false }) {
  return (
    <div className="dashboard-list">
      {Array.from({ length: rows }).map((_, index) => (
        <div className={`dashboard-list-row dashboard-row-skeleton-item ${compact ? 'dashboard-row-skeleton-item--compact' : ''}`} key={index}>
          <Skeleton.Avatar active size={compact ? 28 : 34} shape="square" className="dashboard-row-skeleton-icon" />
          <span className="dashboard-row-skeleton-copy">
            <Skeleton.Input active size="small" className="dashboard-row-skeleton-title" />
            {!compact ? <Skeleton.Input active size="small" className="dashboard-row-skeleton-subtitle" /> : null}
          </span>
          <Skeleton.Input active size="small" className="dashboard-row-skeleton-badge" />
        </div>
      ))}
    </div>
  )
}

function CustomerList({ customers, loading, locale, t }) {
  if (loading) {
    return <DashboardRowSkeleton />
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

function StockPanel({ loading, locale, onThresholdChange, products, t, threshold }) {
  const stockTotal = products?.length || 0
  const outOfStockTotal = products?.filter(product => product.stock <= 0).length || 0
  const lowStockTotal = Math.max(0, stockTotal - outOfStockTotal)
  const stockChartData = stockTotal
    ? [
        { key: 'out', value: outOfStockTotal, color: 'var(--dashboard-danger)' },
        { key: 'low', value: lowStockTotal, color: 'var(--dashboard-warning)' }
      ].filter(item => item.value > 0)
    : [{ key: 'empty', value: 1, color: 'var(--dashboard-surface-3)' }]
  const thresholdItems = [3, 5, 10].map(value => ({
    key: String(value),
    label: t('charts.stock.thresholdOption', { count: value }),
    onClick: () => onThresholdChange(value)
  }))

  return (
    <div className="dashboard-panel dashboard-stock-widget">
      <div className="dashboard-panel-header dashboard-panel-header--action">
        <h2>{t('charts.stock.title')}</h2>
        <Dropdown menu={{ items: thresholdItems, selectedKeys: [String(threshold)] }} trigger={['click']} placement="bottomRight" overlayClassName="dashboard-threshold-dropdown">
          <button type="button" className="dashboard-panel-icon-btn" aria-label={t('charts.stock.changeThreshold')}>
            <MoreHorizontal size={16} />
          </button>
        </Dropdown>
      </div>

      {loading ? (
        <DashboardRowSkeleton />
      ) : products?.length ? (
        <div className="dashboard-stock-widget-body">
          <div className="dashboard-stock-widget-summary">
            <div className="dashboard-stock-donut">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={stockChartData} dataKey="value" cx="50%" cy="50%" innerRadius={48} outerRadius={66} paddingAngle={2} stroke="var(--dashboard-surface)" strokeWidth={2}>
                    {stockChartData.map(entry => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="dashboard-stock-donut-center">
                <strong>{stockTotal.toLocaleString(locale)}</strong>
                <span>{t('charts.stock.total')}</span>
              </div>
            </div>

            <div className="dashboard-stock-breakdown">
              <div>
                <span className="dashboard-stock-dot danger" />
                <strong>{outOfStockTotal.toLocaleString(locale)}</strong>
                <em>{t('charts.stock.out')}</em>
              </div>
              <div>
                <span className="dashboard-stock-dot warning" />
                <strong>{lowStockTotal.toLocaleString(locale)}</strong>
                <em>{t('charts.stock.low')}</em>
              </div>
            </div>
          </div>

          <div className="dashboard-stock-items">
            <h3>{t('charts.stock.items')}</h3>
            {products.map(product => (
              <div className="dashboard-stock-item" key={product.id || product.name}>
                <span className="dashboard-stock-thumb">
                  {product.thumbnail ? <img src={product.thumbnail} alt={product.name} /> : product.name?.charAt(0)?.toUpperCase() || 'P'}
                </span>
                <span className="dashboard-stock-copy">
                  <strong>{product.name}</strong>
                </span>
                <span className={`dashboard-stock-count ${product.stock <= 0 ? 'danger' : 'warning'}`}>
                  {product.stock <= 0 ? t('charts.stock.out') : t('charts.stock.left', { count: product.stock.toLocaleString(locale) })}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="dashboard-stock-empty">{t('charts.stock.empty')}</div>
      )}
    </div>
  )
}

function OrdersList({ loading, locale, orders, t }) {
  if (loading) {
    return <DashboardRowSkeleton />
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

export function PendingActionsPanel({ actions, loading }) {
  const { t } = useTranslation('adminDashboard')
  const rows = [
    {
      key: 'orders',
      title: t('pendingActions.orders.title'),
      count: actions?.ordersToConfirm || 0,
      to: '/admin/orders'
    },
    {
      key: 'refunds',
      title: t('pendingActions.refunds.title'),
      count: actions?.refundsToProcess || 0,
      to: '/admin/orders'
    },
    {
      key: 'receipts',
      title: t('pendingActions.receipts.title'),
      count: actions?.receiptsToReview || 0,
      to: '/admin/purchase-receipts'
    },
    {
      key: 'reviews',
      title: t('pendingActions.reviews.title'),
      count: actions?.reviewsToApprove || 0,
      to: '/admin/reviews'
    }
  ]
  const total = rows.reduce((sum, row) => sum + (Number(row.count) || 0), 0)

  return (
    <div className="dashboard-panel dashboard-pending-actions">
      <div className="dashboard-pending-actions-head">
        <div>
          <h2>
            <span>{t('pendingActions.title')}</span>
            <strong>{t('pendingActions.total', { count: total })}</strong>
          </h2>
          <p>{t('pendingActions.subtitle')}</p>
        </div>
      </div>

      {loading ? (
        <DashboardRowSkeleton rows={4} compact />
      ) : (
        <div className="dashboard-pending-actions-list">
          {rows.map(row => (
            <Link className="dashboard-pending-action-row" key={row.key} to={row.to}>
              <span className="dashboard-pending-action-copy">
                <strong>{row.title}</strong>
              </span>
              <span className="dashboard-pending-action-count">{row.count}</span>
            </Link>
          ))}
        </div>
      )}

      <Link className="dashboard-pending-actions-button" to="/admin/orders">
        <span>{t('pendingActions.viewAll')}</span>
      </Link>
    </div>
  )
}

export default function Activity({
  lowStockProducts,
  lowStockProductsLoading,
  lowStockThreshold,
  onLowStockThresholdChange,
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
    <section className="dashboard-bottom-grid dashboard-bottom-grid--three">
      <StockPanel loading={lowStockProductsLoading} locale={locale} onThresholdChange={onLowStockThresholdChange} products={lowStockProducts || []} t={t} threshold={lowStockThreshold} />

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
