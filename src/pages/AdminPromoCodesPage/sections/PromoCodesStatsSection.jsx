import { CalendarClock, CheckCircle2, Tags, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatNumber, getPromoCodeStats } from '../utils/promoCodeHelpers'

export default function PromoCodesStatsSection({ promoCodes, language }) {
  const { t } = useTranslation('adminPromoCodes')
  const stats = getPromoCodeStats(promoCodes)

  const items = [
    {
      key: 'total',
      label: t('stats.total'),
      value: formatNumber(stats.total, language),
      icon: Tags
    },
    {
      key: 'active',
      label: t('stats.active'),
      value: formatNumber(stats.active, language),
      icon: CheckCircle2
    },
    {
      key: 'expired',
      label: t('stats.expired'),
      value: formatNumber(stats.expired, language),
      icon: CalendarClock
    },
    {
      key: 'usage',
      label: t('stats.usage'),
      value: formatNumber(stats.totalUsed, language),
      icon: UsersRound
    }
  ]

  return (
    <section className="admin-promo-stats-section grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {items.map(item => {
        const Icon = item.icon

        return (
          <article
            key={item.key}
            className={`admin-promo-stat-card admin-promo-stat-card--${item.key} rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)]`}
          >
            <div className="flex items-center gap-3">
              <span className="admin-promo-stat-card__icon">
                <Icon className="h-5 w-5" />
              </span>

              <div className="min-w-0">
                <p className="admin-promo-stat-card__label">{item.label}</p>
                <p className="admin-promo-stat-card__value">{item.value}</p>
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}
