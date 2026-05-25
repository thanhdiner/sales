import React from 'react'
import { Empty } from 'antd'
import { ShoppingCart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useDashboardRecentOrders } from '../hooks/useDashboardQueries'
import { formatCurrency, getDashboardLocale } from '../utils/dashboardTransforms'
import { STATUS_CONFIG } from './activity.constants'
import { extractClock } from './activity.utils'
import DashboardRowSkeleton from './DashboardRowSkeleton'

export default function RecentOrdersPanel() {
  const { t, i18n } = useTranslation('adminDashboard')
  const { recentOrders: orders, recentOrdersLoading } = useDashboardRecentOrders()
  const locale = getDashboardLocale(i18n.language)

  return (
    <div className="dashboard-panel">
      <div className="dashboard-panel-header dashboard-panel-header--action">
        <h2>{t('activity.recentOrders')}</h2>
        <Link to="/admin/orders">{t('common.viewAll')}</Link>
      </div>

      {recentOrdersLoading ? (
        <DashboardRowSkeleton />
      ) : orders?.length ? (
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
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('activity.emptyOrders')} />
      )}
    </div>
  )
}
