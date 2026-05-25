import { Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import { getDashboardLocale } from '../utils/dashboardTransforms'
import { useDashboardStats } from '../hooks/useDashboardQueries'
import { buildFunnelItems } from './chart.utils'

export default function ConversionFunnelPanel() {
  const { t, i18n } = useTranslation('adminDashboard')
  const { statsData, statsLoading } = useDashboardStats()
  const locale = getDashboardLocale(i18n.language)
  const funnelItems = buildFunnelItems(statsData, t, locale)
  const orders = funnelItems.find(item => item.key === 'orders')
  const completed = funnelItems.find(item => item.key === 'completed')
  const orderCount = Number(orders?.count) || 0
  const completedCount = Number(completed?.count) || 0
  const dropOffCount = Math.max(orderCount - completedCount, 0)
  const completionRate = orderCount ? Math.round((completedCount / orderCount) * 100) : 0
  const funnelSummary = [
    { label: t('charts.funnel.completionRate'), value: `${completionRate}%`, tone: 'info' },
    {
      label: t('charts.funnel.completedOrders'),
      value: t('charts.funnel.completedOfOrders', {
        completed: completed?.value || '0',
        orders: orders?.value || '0'
      }),
      tone: 'success'
    },
    {
      label: t('charts.funnel.dropOff'),
      value: t('charts.funnel.notCompleted', {
        count: dropOffCount.toLocaleString(locale)
      }),
      tone: 'warning'
    }
  ]

  return (
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
        <div className="dashboard-funnel-body">
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

          <div className="dashboard-funnel-footer">
            {funnelSummary.map(item => (
              <div className={`dashboard-funnel-metric ${item.tone}`} key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


