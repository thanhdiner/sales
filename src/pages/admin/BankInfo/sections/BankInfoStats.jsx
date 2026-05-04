import { Building2, CircleCheck, CirclePause, QrCode } from 'lucide-react'
import { StatCard, StatGrid } from '@/components/admin/ui'

function getBankInfoStats(bankInfos) {
  return bankInfos.reduce(
    (stats, bankInfo) => ({
      total: stats.total + 1,
      active: stats.active + (bankInfo.isActive ? 1 : 0),
      inactive: stats.inactive + (bankInfo.isActive ? 0 : 1),
      withQr: stats.withQr + (bankInfo.qrCode ? 1 : 0)
    }),
    {
      total: 0,
      active: 0,
      inactive: 0,
      withQr: 0
    }
  )
}

export default function BankInfoStats({ bankInfos, t }) {
  const stats = getBankInfoStats(bankInfos)
  const statItems = [
    {
      key: 'total',
      label: t('stats.total'),
      meta: t('stats.totalDesc'),
      icon: Building2
    },
    {
      key: 'active',
      label: t('stats.active'),
      meta: t('stats.activeDesc'),
      icon: CircleCheck
    },
    {
      key: 'inactive',
      label: t('stats.inactive'),
      meta: t('stats.inactiveDesc'),
      icon: CirclePause
    },
    {
      key: 'withQr',
      label: t('stats.withQr'),
      meta: t('stats.withQrDesc'),
      icon: QrCode
    }
  ]

  return (
    <StatGrid className="admin-bank-info-stats" columns={4}>
      {statItems.map(item => (
        <StatCard
          key={item.key}
          label={item.label}
          value={stats[item.key]}
          meta={item.meta}
          icon={item.icon}
          className="admin-bank-info-stat-card"
        />
      ))}
    </StatGrid>
  )
}
