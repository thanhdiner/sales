import { Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import { getDashboardLocale } from '../utils/dashboardTransforms'
import { useDashboardStats } from '../hooks/useDashboardQueries'
import { buildOverviewRows } from './chart.utils'

export default function QuickOverviewPanel() {
  const { t, i18n } = useTranslation('adminDashboard')
  const { statsData, statsLoading } = useDashboardStats()
  const locale = getDashboardLocale(i18n.language)
  const overviewRows = buildOverviewRows(statsData, t, locale)

  return (
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
  )
}
