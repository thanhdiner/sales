import { AppstoreOutlined, CheckSquareOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function AdminPermissionGroupsStatsSection({ groups }) {
  const { t } = useTranslation('adminPermissionGroups')
  const stats = {
    total: groups.length,
    active: groups.filter(group => group.isActive).length,
    inactive: groups.filter(group => !group.isActive).length
  }

  const statItems = [
    {
      key: 'total',
      label: t('stats.total'),
      value: stats.total,
      icon: <AppstoreOutlined />,
      className: 'admin-permission-groups-stat-card admin-permission-groups-stat-card--total'
    },
    {
      key: 'active',
      label: t('stats.active'),
      value: stats.active,
      icon: <CheckSquareOutlined />,
      className: 'admin-permission-groups-stat-card admin-permission-groups-stat-card--active'
    },
    {
      key: 'inactive',
      label: t('stats.inactive'),
      value: stats.inactive,
      icon: <PauseCircleOutlined />,
      className: 'admin-permission-groups-stat-card admin-permission-groups-stat-card--inactive'
    }
  ]

  return (
    <div className="admin-permission-groups-stats">
      {statItems.map(item => (
        <div key={item.key} className={item.className}>
          <span className="admin-permission-groups-stat-card__icon">{item.icon}</span>

          <div className="admin-permission-groups-stat-card__content">
            <p className="admin-permission-groups-stat-card__label">{item.label}</p>
            <p className="admin-permission-groups-stat-card__value">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
