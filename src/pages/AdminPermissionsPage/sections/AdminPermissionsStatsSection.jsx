import { CheckCircleOutlined, LockOutlined, StopOutlined } from '@ant-design/icons'

export default function AdminPermissionsStatsSection({ permissionList, t }) {
  const permissions = Array.isArray(permissionList) ? permissionList : []
  const stats = {
    total: permissions.length,
    active: permissions.filter(permission => permission.isActive !== false && !permission.deleted).length,
    inactive: permissions.filter(permission => permission.isActive === false && !permission.deleted).length
  }

  const statItems = [
    {
      key: 'total',
      label: t('stats.total'),
      icon: LockOutlined,
      tone: 'total'
    },
    {
      key: 'active',
      label: t('stats.active'),
      icon: CheckCircleOutlined,
      tone: 'active'
    },
    {
      key: 'inactive',
      label: t('stats.inactive'),
      icon: StopOutlined,
      tone: 'inactive'
    }
  ]

  return (
    <div className="admin-permissions-stats">
      {statItems.map(item => {
        const Icon = item.icon

        return (
          <div key={item.key} className={`admin-permissions-stat-card admin-permissions-stat-card--${item.tone}`}>
            <span className="admin-permissions-stat-card__icon">
              <Icon />
            </span>

            <div className="admin-permissions-stat-card__body">
              <span className="admin-permissions-stat-card__label">{item.label}</span>
              <strong className="admin-permissions-stat-card__value">{stats[item.key]}</strong>
            </div>
          </div>
        )
      })}
    </div>
  )
}
