import { getWidgetStats } from '../utils'

export default function AdminWidgetsStatsSection({ widgets }) {
  const stats = getWidgetStats(widgets)

  return (
    <div className="admin-widgets-stats">
      <div className="admin-widgets-stats__card">
        <p className="admin-widgets-stats__label">Tổng</p>
        <p className="admin-widgets-stats__value">{stats.total}</p>
      </div>

      <div className="admin-widgets-stats__card admin-widgets-stats__card--active">
        <p className="admin-widgets-stats__label">Hoạt động</p>
        <p className="admin-widgets-stats__value">{stats.active}</p>
      </div>

      <div className="admin-widgets-stats__card admin-widgets-stats__card--inactive">
        <p className="admin-widgets-stats__label">Tạm dừng</p>
        <p className="admin-widgets-stats__value">{stats.inactive}</p>
      </div>
    </div>
  )
}
