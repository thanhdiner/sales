import { Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDashboardRecentOrders, useDashboardStats } from '../hooks/useDashboardQueries'
import { getDashboardLocale } from '../utils/dashboardTransforms'
import { buildActivityItems } from './chart.utils'

export default function TodayActivityPanel() {
  const { t, i18n } = useTranslation('adminDashboard')
  const { recentOrders, recentOrdersLoading } = useDashboardRecentOrders()
  const { statsData } = useDashboardStats()
  const locale = getDashboardLocale(i18n.language)
  const activityItems = buildActivityItems(statsData, recentOrders, t, locale)

  return (
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
  )
}
