import { AppstoreOutlined, LineChartOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { AdminStatCard, AdminStatGrid } from '@/components/admin/ui'
import { getWidgetStats } from '../utils'

export default function AdminWidgetsStatsSection({ widgets, t }) {
  const stats = getWidgetStats(widgets)

  const statItems = [
    {
      key: 'total',
      label: t('stats.total'),
      value: stats.total,
      icon: <AppstoreOutlined />
    },
    {
      key: 'active',
      label: t('stats.active'),
      value: stats.active,
      icon: <LineChartOutlined />,
      tone: 'success'
    },
    {
      key: 'inactive',
      label: t('stats.inactive'),
      value: stats.inactive,
      icon: <PauseCircleOutlined />,
      tone: 'danger'
    }
  ]

  return (
    <AdminStatGrid className="admin-widgets-stats" columns={3}>
      {statItems.map(item => (
        <AdminStatCard
          key={item.key}
          label={item.label}
          value={item.value}
          icon={item.icon}
          tone={item.tone}
          className={`admin-widgets-stats__card${item.tone === 'success' ? ' admin-widgets-stats__card--active' : ''}${item.tone === 'danger' ? ' admin-widgets-stats__card--inactive' : ''}`}
        />
      ))}
    </AdminStatGrid>
  )
}
