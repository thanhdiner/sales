import React from 'react'
import { Avatar, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDashboardTopCustomers } from '../hooks/useDashboardQueries'
import { formatCurrency, getDashboardLocale } from '../utils/dashboardTransforms'
import DashboardRowSkeleton from './DashboardRowSkeleton'
import { getInitials } from './activity.utils'

export default function TopCustomersPanel() {
  const { t, i18n } = useTranslation('adminDashboard')
  const { topCustomers, topCustomersLoading } = useDashboardTopCustomers()
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
    <div className="dashboard-panel">
      <div className="dashboard-panel-header dashboard-panel-header--action">
        <h2>{t('activity.topCustomers')}</h2>
      </div>

      {topCustomersLoading ? (
        <DashboardRowSkeleton />
      ) : customers.length ? (
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
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('activity.emptyCustomers')} />
      )}
    </div>
  )
}
