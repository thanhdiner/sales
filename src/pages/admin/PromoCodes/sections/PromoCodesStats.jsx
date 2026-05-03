import { CalendarClock, CheckCircle2, Tags, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminStatCard, AdminStatGrid } from '@/components/admin/ui'
import { formatNumber, getPromoCodeStats } from '../utils/promoCodeHelpers'

export default function PromoCodesStats({ promoCodes, language }) {
  const { t } = useTranslation('adminPromoCodes')
  const stats = getPromoCodeStats(promoCodes)

  const items = [
    {
      key: 'total',
      label: t('stats.total'),
      value: formatNumber(stats.total, language),
      meta: t('stats.totalHint'),
      icon: Tags
    },
    {
      key: 'active',
      label: t('stats.active'),
      value: formatNumber(stats.active, language),
      meta: t('stats.activeHint'),
      icon: CheckCircle2
    },
    {
      key: 'expired',
      label: t('stats.expired'),
      value: formatNumber(stats.expired, language),
      meta: t('stats.expiredHint'),
      icon: CalendarClock
    },
    {
      key: 'usage',
      label: t('stats.usage'),
      value: formatNumber(stats.totalUsed, language),
      meta: t('stats.usageHint'),
      icon: UsersRound
    }
  ]

  return (
    <AdminStatGrid className="admin-promo-stats-section" columns={4}>
      {items.map(item => (
        <AdminStatCard
          key={item.key}
          className={`admin-promo-stat-card admin-promo-stat-card--${item.key}`}
          label={item.label}
          value={item.value}
          meta={item.meta}
          icon={item.icon}
        />
      ))}
    </AdminStatGrid>
  )
}
