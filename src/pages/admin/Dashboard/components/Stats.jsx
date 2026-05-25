import { useMemo } from 'react'
import { Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDashboardFinanceStats, useDashboardInventoryStats, useDashboardUserStats } from '../hooks/useDashboardQueries'
import { buildStatCards } from '../utils/buildStatCards'
import StatCard from './StatCard'

const STAT_GROUPS = [
  { key: 'users', useStats: useDashboardUserStats },
  { key: 'finance', useStats: useDashboardFinanceStats },
  { key: 'inventory', useStats: useDashboardInventoryStats }
]

function StatGroup({ group, useStats }) {
  const { t } = useTranslation('adminDashboard')
  const { statsData, statsLoading } = useStats()

  const statCards = useMemo(() => {
    return buildStatCards(statsData, t).filter(card => card.group === group)
  }, [group, statsData, t])

  return (
    <div className="dashboard-vitals-group">
      <div className="stats-row">
        {statsLoading
          ? Array.from({ length: 2 }).map((_, index) => <Skeleton.Button key={index} block active className="dashboard-card-skeleton" />)
          : statCards.map(card => <StatCard key={card.title} {...card} />)}
      </div>
    </div>
  )
}

export default function Stats() {
  return (
    <section className="dashboard-vitals-grid">
      {STAT_GROUPS.map(group => (
        <StatGroup key={group.key} group={group.key} useStats={group.useStats} />
      ))}
    </section>
  )
}
