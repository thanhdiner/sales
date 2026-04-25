import { Building2, CircleCheck, CirclePause, QrCode } from 'lucide-react'

const statItems = [
  {
    key: 'total',
    label: 'Tổng tài khoản',
    icon: Building2
  },
  {
    key: 'active',
    label: 'Đang dùng',
    icon: CircleCheck
  },
  {
    key: 'inactive',
    label: 'Chưa kích hoạt',
    icon: CirclePause
  },
  {
    key: 'withQr',
    label: 'Có QR',
    icon: QrCode
  }
]

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

export default function AdminBankInfoStatsSection({ bankInfos }) {
  const stats = getBankInfoStats(bankInfos)

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

