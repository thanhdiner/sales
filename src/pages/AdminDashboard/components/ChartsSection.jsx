import React from 'react'
import { Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import { CircleDollarSign, PackagePlus, ShieldCheck, UserPlus } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'
import { formatCurrency, getDashboardLocale } from '../utils/dashboardTransforms'

const ORDER_STATUS_ITEMS = [
  { key: 'pending', labelKey: 'status.pending', color: 'var(--dashboard-success)' },
  { key: 'confirmed', labelKey: 'status.confirmed', color: 'var(--dashboard-info)' },
  { key: 'shipping', labelKey: 'status.shipping', color: 'var(--dashboard-warning)' },
  { key: 'completed', labelKey: 'status.completed', color: '#94a3b8' },
  { key: 'cancelled', labelKey: 'status.cancelled', color: 'var(--dashboard-danger)' }
]

const extractClock = value => {
  if (!value) return '--:--'
  return String(value).match(/\d{1,2}:\d{2}/)?.[0] || '--:--'
}

const clampPercent = value => Math.max(0, Math.min(100, Number(value) || 0))

const percentOf = (value, target) => clampPercent(((Number(value) || 0) / target) * 100)

const formatNumber = (value, locale) => (Number(value) || 0).toLocaleString(locale)

function buildOverviewRows(statsData, t, locale) {
  return [
    {
      label: t('charts.rows.customers'),
      value: `${formatNumber(statsData.totalUsers.value, locale)}/1000`,
      percent: percentOf(statsData.totalUsers.value, 1000)
    },
    {
      label: t('charts.rows.orders'),
      value: `${formatNumber(statsData.order.all.total, locale)}/1000`,
      percent: percentOf(statsData.order.all.total, 1000)
    },
    {
      label: t('charts.rows.revenue'),
      value: formatCurrency(statsData.totalRevenue.value, locale),
      percent: clampPercent(statsData.totalRevenue.change)
    },
    {
      label: t('charts.rows.profit'),
      value: formatCurrency(statsData.profit.value, locale),
      percent: clampPercent(statsData.profit.change)
    },
    {
      label: t('charts.rows.products'),
      value: `${formatNumber(statsData.product.total, locale)}/1000`,
      percent: percentOf(statsData.product.total, 1000)
    },
    {
      label: t('charts.rows.categories'),
      value: `${formatNumber(statsData.category.total, locale)}/100`,
      percent: percentOf(statsData.category.total, 100)
    }
  ]
}

function buildActivityItems(statsData, recentOrders, t, locale) {
  const latestOrderTime = extractClock(recentOrders?.[0]?.time)

  return [
    {
      title: t('charts.activity.newOrders'),
      detail: t('charts.activity.newThisWeek', {
        count: formatNumber(statsData.order.all.new.current, locale)
      }),
      time: latestOrderTime,
      icon: <ShieldCheck size={18} />,
      tone: 'green'
    },
    {
      title: t('charts.activity.newCustomers'),
      detail: t('charts.activity.newThisWeek', {
        count: formatNumber(statsData.totalUsers.new.current, locale)
      }),
      time: '09:15',
      icon: <UserPlus size={18} />,
      tone: 'blue'
    },
    {
      title: t('charts.activity.newProducts'),
      detail: t('charts.activity.newThisWeek', {
        count: formatNumber(statsData.product.new.current, locale)
      }),
      time: '08:42',
      icon: <PackagePlus size={18} />,
      tone: 'purple'
    },
    {
      title: t('charts.activity.todayRevenue'),
      detail: formatCurrency(statsData.totalRevenue.value, locale),
      time: '00:01',
      icon: <CircleDollarSign size={18} />,
      tone: 'green'
    }
  ]
}

export default function ChartsSection({ recentOrders, recentOrdersLoading, statsData, statsLoading }) {
  const { t, i18n } = useTranslation('adminDashboard')
  const locale = getDashboardLocale(i18n.language)
  const overviewRows = buildOverviewRows(statsData, t, locale)
  const orderStatusData = ORDER_STATUS_ITEMS.map(item => ({
    ...item,
    label: t(item.labelKey),
    value: Number(statsData.order[item.key]?.total) || 0
  }))
  const orderTotal = Number(statsData.order.all.total) || 0
  const chartData = orderTotal > 0 ? orderStatusData : [{ key: 'empty', label: t('charts.empty'), value: 1, color: 'var(--dashboard-surface-3)' }]
  const activityItems = buildActivityItems(statsData, recentOrders, t, locale)

  return (
    <section className="dashboard-overview-grid">
      <div className="dashboard-panel dashboard-quick-panel">
        <div className="dashboard-panel-header">
          <h2>{t('charts.quickOverview')}</h2>
        </div>

        {statsLoading ? (
          <div className="dashboard-stack">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton.Input key={index} active block className="dashboard-line-skeleton" />
            ))}
          </div>
        ) : (
          <div className="dashboard-progress-list">
            {overviewRows.map(row => (
              <div className="dashboard-progress-row" key={row.label}>
                <div className="dashboard-progress-meta">
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                  <em>{Math.round(row.percent)}%</em>
                </div>
                <div className="dashboard-progress-track">
                  <span style={{ width: `${row.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-panel dashboard-order-panel">
        <div className="dashboard-panel-header">
          <h2>{t('charts.orderStatus')}</h2>
        </div>

        {statsLoading ? (
          <Skeleton.Input active block className="dashboard-donut-skeleton" />
        ) : (
          <div className="dashboard-order-content">
            <div className="dashboard-donut-wrap">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={78}
                    outerRadius={112}
                    paddingAngle={orderTotal > 0 ? 2 : 0}
                    stroke="var(--dashboard-surface)"
                    strokeWidth={2}
                  >
                    {chartData.map(entry => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value, name, props) => [formatNumber(value, locale), props?.payload?.label || name]}
                    contentStyle={{
                      backgroundColor: 'var(--dashboard-surface-2)',
                      border: '1px solid var(--dashboard-border-strong)',
                      color: 'var(--dashboard-text)',
                      borderRadius: 8
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="dashboard-donut-center">
                <strong>{formatNumber(orderTotal, locale)}</strong>
                <span>{t('charts.totalOrders')}</span>
              </div>
            </div>

            <div className="dashboard-status-list">
              {orderStatusData.map(item => {
                const percent = orderTotal ? Math.round((item.value / orderTotal) * 100) : 0

                return (
                  <div className="dashboard-status-row" key={item.key}>
                    <span className="dashboard-status-dot" style={{ background: item.color }} />
                    <span>{item.label}</span>
                    <strong>
                      {formatNumber(item.value, locale)} <em>({percent}%)</em>
                    </strong>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-panel dashboard-activity-panel">
        <div className="dashboard-panel-header">
          <h2>{t('charts.todayActivity')}</h2>
        </div>

        {recentOrdersLoading ? (
          <div className="dashboard-stack">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton.Input key={index} active block className="dashboard-activity-skeleton" />
            ))}
          </div>
        ) : (
          <div className="dashboard-activity-list">
            {activityItems.map(item => (
              <div className="dashboard-activity-item" key={item.title}>
                <span className={`dashboard-activity-icon ${item.tone}`}>{item.icon}</span>
                <span className="dashboard-activity-copy">
                  <strong>{item.title}</strong>
                  <em>{item.detail}</em>
                </span>
                <span className="dashboard-activity-time">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
