import { Building2, CircleCheck, CirclePause, QrCode } from 'lucide-react'

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

export default function AdminBankInfoStatsSection({ bankInfos, t }) {
  const stats = getBankInfoStats(bankInfos)
  const statItems = [
    {
      key: 'total',
      label: t('stats.total'),
      icon: Building2
    },
    {
      key: 'active',
      label: t('stats.active'),
      icon: CircleCheck
    },
    {
      key: 'inactive',
      label: t('stats.inactive'),
      icon: CirclePause
    },
    {
      key: 'withQr',
      label: t('stats.withQr'),
      icon: QrCode
    }
  ]

  return (
    <div className="admin-bank-info-stats">
      {statItems.map(item => {
        const Icon = item.icon

        return (
          <div key={item.key} className="admin-bank-info-stat-card">
            <div className="admin-bank-info-stat-card__row">
              <div>
                <p className="admin-bank-info-stat-card__label">{item.label}</p>
                <p className="admin-bank-info-stat-card__value">{stats[item.key]}</p>
              </div>

              <div className="admin-bank-info-stat-card__icon">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
