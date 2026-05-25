import { Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency, getDashboardLocale, getSalesChartTitle } from '../utils/dashboardTransforms'

import { useDashboardSalesChart } from '../hooks/useDashboardQueries'

export default function RevenueChartPanel({ dateRange }) {
  const { t, i18n } = useTranslation('adminDashboard')
  const { salesData, salesLoading } = useDashboardSalesChart(dateRange)
  const locale = getDashboardLocale(i18n.language)
  const revenueChartData = salesData?.length ? salesData : [{ name: t('charts.empty'), value: 0 }]
  const revenueRangeTotal = (salesData || []).reduce((total, item) => total + (Number(item.value) || 0), 0)

  return (
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
  )
}
