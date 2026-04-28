import { AppstoreOutlined, LineChartOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { getWidgetStats } from '../utils'

export default function AdminWidgetsStatsSection({ widgets, t }) {
  const stats = getWidgetStats(widgets)

  const statItems = [
    {
      key: 'total',
      label: t('stats.total'),
      value: stats.total,
      icon: <AppstoreOutlined />,
      cardClass: 'admin-widgets-stats__card'
    },
    {
      key: 'active',
      label: t('stats.active'),
      value: stats.active,
      icon: <LineChartOutlined />,
      cardClass: 'admin-widgets-stats__card admin-widgets-stats__card--active'
    },
    {
      key: 'inactive',
      label: t('stats.inactive'),
      value: stats.inactive,
      icon: <PauseCircleOutlined />,
      cardClass: 'admin-widgets-stats__card admin-widgets-stats__card--inactive'
    }
  ]

  return (
    <div className="admin-widgets-stats">
      {statItems.map(item => (
        <div key={item.key} className={item.cardClass}>
          <div className="admin-widgets-stats__content">
            <p className="admin-widgets-stats__label">{item.label}</p>
            <p className="admin-widgets-stats__value">{item.value}</p>
          </div>

          <span className="admin-widgets-stats__icon">{item.icon}</span>
        </div>
      ))}
    </div>
  )
}
