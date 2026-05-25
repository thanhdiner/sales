import { Skeleton } from 'antd'
import { MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'
import { useDashboardPaymentMethods } from '../hooks/useDashboardQueries'
import { formatCurrency, getDashboardLocale } from '../utils/dashboardTransforms'

export default function PaymentMethodsPanel({ dateRange }) {
  const { t, i18n } = useTranslation('adminDashboard')
  const { paymentMethodData, paymentMethodsLoading } = useDashboardPaymentMethods(dateRange)
  const locale = getDashboardLocale(i18n.language)
  const paymentTotal = (paymentMethodData || []).reduce((total, item) => total + (Number(item.value) || 0), 0)
  const paymentChartData = paymentTotal > 0
    ? paymentMethodData
    : [{ key: 'empty', label: t('charts.empty'), value: 1, count: 0, color: 'var(--dashboard-surface-3)' }]

  return (
    <div className="dashboard-panel dashboard-payment-panel">
      <div className="dashboard-panel-header">
        <h2>{t('charts.paymentMethods.title')}</h2>
        <button className="dashboard-panel-icon-btn" type="button" aria-label={t('charts.paymentMethods.actions')}>
          <MoreHorizontal size={16} />
        </button>
      </div>

      {paymentMethodsLoading ? (
        <Skeleton.Input active block className="dashboard-donut-skeleton" />
      ) : (
        <div className="dashboard-payment-content">
          <div className="dashboard-payment-donut-wrap">
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={paymentChartData} dataKey="value" cx="50%" cy="50%" innerRadius={62} outerRadius={92} paddingAngle={paymentTotal > 0 ? 2 : 0} stroke="var(--dashboard-surface)" strokeWidth={2}>
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
  )
}
