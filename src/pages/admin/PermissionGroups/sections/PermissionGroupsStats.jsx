import { AppstoreOutlined, CheckSquareOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { StatCard, StatGrid } from '@/components/admin/ui'

export default function PermissionGroupsStats({ groups }) {
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
      meta: t('stats.totalHint'),
      icon: <AppstoreOutlined />
    },
    {
      key: 'active',
      label: t('stats.active'),
      value: stats.active,
      meta: t('stats.activeHint'),
      icon: <CheckSquareOutlined />
    },
    {
      key: 'inactive',
      label: t('stats.inactive'),
      value: stats.inactive,
      meta: t('stats.inactiveHint'),
      icon: <PauseCircleOutlined />
    }
  ]

  return (
    <StatGrid className="admin-permission-groups-stats" columns={3}>
      {statItems.map(item => (
        <StatCard
          key={item.key}
          label={item.label}
          value={item.value}
          meta={item.meta}
          icon={item.icon}
        />
      ))}
    </StatGrid>
  )
}
