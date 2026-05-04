import { AppstoreOutlined, LineChartOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { StatCard, StatGrid } from '@/components/admin/ui'
import { getWidgetStats } from '../utils'

export default function WidgetsStats({ widgets, t }) {
  const stats = getWidgetStats(widgets)

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
      icon: <LineChartOutlined />
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
    <StatGrid className="admin-widgets-stats" columns={3}>
      {statItems.map(item => (
        <StatCard
          key={item.key}
          label={item.label}
          value={item.value}
          meta={item.meta}
          icon={item.icon}
          className="admin-widgets-stats__card"
        />
      ))}
    </StatGrid>
  )
}
