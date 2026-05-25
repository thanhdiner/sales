import { Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'
import { getDashboardLocale } from '../utils/dashboardTransforms'
import { useDashboardStats } from '../hooks/useDashboardQueries'
import { ORDER_STATUS_ITEMS } from './chart.constants'
import { formatNumber } from './chart.utils'

export default function OrderStatusPanel() {
  const { t, i18n } = useTranslation('adminDashboard')
  const { statsData, statsLoading } = useDashboardStats()
  const locale = getDashboardLocale(i18n.language)
  const orderStatusData = ORDER_STATUS_ITEMS.map(item => ({
    ...item,
    label: t(item.labelKey),
    value: Number(statsData.order[item.key]?.total) || 0
  }))
  const orderTotal = Number(statsData.order.all.total) || 0
  const chartData = orderTotal > 0 ? orderStatusData : [{ key: 'empty', label: t('charts.empty'), value: 1, color: 'var(--dashboard-surface-3)' }]

  return (
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
                <Pie data={chartData} dataKey="value" cx="50%" cy="50%" innerRadius={78} outerRadius={112} paddingAngle={orderTotal > 0 ? 2 : 0} stroke="var(--dashboard-surface)" strokeWidth={2}>
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
  )
}
