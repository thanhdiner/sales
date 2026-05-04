import { CheckCircleOutlined, LockOutlined, StopOutlined } from '@ant-design/icons'
import { StatCard, StatGrid } from '@/components/admin/ui'

export default function PermissionsStats({ permissionList, t }) {
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
      meta: t('stats.totalHint'),
      icon: LockOutlined
    },
    {
      key: 'active',
      label: t('stats.active'),
      meta: t('stats.activeHint'),
      icon: CheckCircleOutlined
    },
    {
      key: 'inactive',
      label: t('stats.inactive'),
      meta: t('stats.inactiveHint'),
      icon: StopOutlined
    }
  ]

  return (
    <StatGrid className="admin-permissions-stats" columns={3}>
      {statItems.map(item => (
        <StatCard
          key={item.key}
          label={item.label}
          value={stats[item.key]}
          meta={item.meta}
          icon={item.icon}
        />
      ))}
    </StatGrid>
  )
}
