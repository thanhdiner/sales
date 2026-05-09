import { Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import { CircleDollarSign, MoreHorizontal, PackagePlus, ShieldCheck, UserPlus } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency, getDashboardLocale, getSalesChartTitle } from '../utils/dashboardTransforms'
import { PendingActionsPanel } from './Activity'

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

function buildFunnelItems(statsData, t, locale) {
  const funnel = statsData.conversionFunnel || {}
  const rawItems = [
    { key: 'visitors', label: t('charts.funnel.visitors'), count: Number(funnel.visitors) || 0 },
    { key: 'productViews', label: t('charts.funnel.productViews'), count: Number(funnel.productViews) || 0 },
    { key: 'addToCart', label: t('charts.funnel.addToCart'), count: Number(funnel.addToCart) || 0 },
    { key: 'orders', label: t('charts.funnel.orders'), count: Number(funnel.orders) || 0 },
    { key: 'completed', label: t('charts.funnel.completed'), count: Number(funnel.completed) || 0 }
  ]
  const maxValue = Math.max(...rawItems.map(item => item.count), 1)

  return rawItems.map(item => ({
    ...item,
    value: formatNumber(item.count, locale),
    percent: clampPercent((item.count / maxValue) * 100)
  }))
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

export default function Charts({
  dateRange,
  paymentMethodData,
  pendingActions,
  recentOrders,
  recentOrdersLoading,
  salesData,
  salesLoading,
  statsData,
  statsLoading
}) {
  const { t, i18n } = useTranslation('adminDashboard')
  const locale = getDashboardLocale(i18n.language)
  const overviewRows = buildOverviewRows(statsData, t, locale)
  const revenueChartData = salesData?.length ? salesData : [{ name: t('charts.empty'), value: 0 }]
  const revenueRangeTotal = (salesData || []).reduce((total, item) => total + (Number(item.value) || 0), 0)
  const paymentTotal = (paymentMethodData || []).reduce((total, item) => total + (Number(item.value) || 0), 0)
  const paymentChartData = paymentTotal > 0
    ? paymentMethodData
    : [{ key: 'empty', label: t('charts.empty'), value: 1, count: 0, color: 'var(--dashboard-surface-3)' }]
  const orderStatusData = ORDER_STATUS_ITEMS.map(item => ({
    ...item,
    label: t(item.labelKey),
    value: Number(statsData.order[item.key]?.total) || 0
  }))
  const orderTotal = Number(statsData.order.all.total) || 0
  const chartData = orderTotal > 0 ? orderStatusData : [{ key: 'empty', label: t('charts.empty'), value: 1, color: 'var(--dashboard-surface-3)' }]
  const funnelItems = buildFunnelItems(statsData, t, locale)
  const activityItems = buildActivityItems(statsData, recentOrders, t, locale)

  return (
    <section className="dashboard-overview-grid">
      <div className="dashboard-panel dashboard-revenue-panel">
        <div className="dashboard-panel-header">
          <h2>{getSalesChartTitle(dateRange, t)}</h2>
          <span>{formatCurrency(revenueRangeTotal, locale)}</span>
        </div>

        {salesLoading ? (
          <Skeleton.Input active block className="dashboard-revenue-skeleton" />
        ) : (
          <div className="dashboard-revenue-chart">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueChartData} margin={{ top: 18, right: 18, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--dashboard-success)" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="var(--dashboard-success)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--dashboard-border)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--dashboard-text-muted)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--dashboard-text-muted)', fontSize: 12 }} tickFormatter={value => formatCurrency(value, locale).replace('₫', '').trim()} width={86} />
                <RechartsTooltip
                  formatter={value => [formatCurrency(value, locale), t('charts.rows.revenue')]}
                  contentStyle={{
                    backgroundColor: 'var(--dashboard-surface-2)',
                    border: '1px solid var(--dashboard-border-strong)',
                    color: 'var(--dashboard-text)',
                    borderRadius: 8
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--dashboard-success)" strokeWidth={3} fill="url(#dashboardRevenueGradient)" dot={false} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

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

      <div className="dashboard-panel dashboard-payment-panel">
        <div className="dashboard-panel-header">
          <h2>{t('charts.paymentMethods.title')}</h2>
          <button className="dashboard-panel-icon-btn" type="button" aria-label={t('charts.paymentMethods.actions')}>
            <MoreHorizontal size={16} />
          </button>
        </div>

        {salesLoading ? (
          <Skeleton.Input active block className="dashboard-donut-skeleton" />
        ) : (
          <div className="dashboard-payment-content">
            <div className="dashboard-payment-donut-wrap">
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={paymentChartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={92}
                    paddingAngle={paymentTotal > 0 ? 2 : 0}
                    stroke="var(--dashboard-surface)"
                    strokeWidth={2}
                  >
                    {paymentChartData.map(entry => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value, name, props) => [formatCurrency(value, locale), props?.payload?.label || name]}
                    contentStyle={{
                      backgroundColor: 'var(--dashboard-surface-2)',
                      border: '1px solid var(--dashboard-border-strong)',
                      color: 'var(--dashboard-text)',
                      borderRadius: 8
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="dashboard-payment-donut-center">
                <strong>{formatCurrency(paymentTotal, locale)}</strong>
                <span>{t('charts.paymentMethods.total')}</span>
              </div>
            </div>

            <div className="dashboard-payment-list">
              {(paymentMethodData || []).slice(0, 5).map(item => {
                const percent = paymentTotal ? Math.round((Number(item.value) / paymentTotal) * 100) : 0

                return (
                  <div className="dashboard-payment-row" key={item.key}>
                    <span className="dashboard-payment-dot" style={{ background: item.color }} />
                    <span>{item.label}</span>
                    <strong>{percent}%</strong>
                    <em>{formatCurrency(item.value, locale)}</em>
                  </div>
                )
              })}
              {paymentTotal <= 0 ? <div className="dashboard-payment-empty">{t('charts.paymentMethods.empty')}</div> : null}
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
            {Array.from({ length: 5 }).map((_, index) => (
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

      <PendingActionsPanel actions={pendingActions} loading={statsLoading} />

      <div className="dashboard-panel dashboard-funnel-panel">
        <div className="dashboard-panel-header">
          <h2>{t('charts.funnel.title')}</h2>
        </div>

        {statsLoading ? (
          <div className="dashboard-stack dashboard-funnel-skeleton-wrap">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton.Input key={index} active block className="dashboard-funnel-skeleton" />
            ))}
          </div>
        ) : (
          <div className="dashboard-funnel-list">
            {funnelItems.map(item => (
              <div className="dashboard-funnel-row" key={item.key}>
                <div className="dashboard-funnel-meta">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <div className="dashboard-funnel-track">
                  <span style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </section>
  )
}
