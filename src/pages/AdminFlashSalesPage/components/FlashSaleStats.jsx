import { Clock, ShoppingCart, Tag, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatCurrency, getFlashSaleStats, getFlashSalesLocale } from '../utils/flashSaleHelpers'

const statCards = [
  {
    key: 'totalRevenue',
    titleKey: 'stats.totalRevenue',
    icon: TrendingUp,
    formatValue: (value, locale) => formatCurrency(value, locale)
  },
  {
    key: 'activeSales',
    titleKey: 'stats.activeSales',
    icon: Clock
  },
  {
    key: 'totalProductsSold',
    titleKey: 'stats.totalProductsSold',
    icon: ShoppingCart
  },
  {
    key: 'totalPrograms',
    titleKey: 'stats.totalPrograms',
    icon: Tag
  }
]

export default function FlashSaleStats({ flashSales }) {
  const { t, i18n } = useTranslation('adminFlashSales')
  const locale = getFlashSalesLocale(i18n.language)
  const stats = getFlashSaleStats(flashSales)

  return (
    <div className="admin-flash-sales-stats mb-6 grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
      {statCards.map(card => {
        const Icon = card.icon
        const value = stats[card.key]

        return (
          <div
            key={card.key}
            className="admin-flash-sales-stat-card rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 shadow-[var(--admin-shadow)] sm:p-4 lg:p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="admin-flash-sales-stat-card__label text-xs font-medium text-[var(--admin-text-muted)] sm:text-sm">
                  {t(card.titleKey)}
                </p>

                <p className="admin-flash-sales-stat-card__value mt-2 text-lg font-semibold text-[var(--admin-text)] sm:text-2xl">
                  {card.formatValue ? card.formatValue(value, locale) : value}
                </p>
              </div>

              <div className="admin-flash-sales-stat-card__icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] sm:h-10 sm:w-10">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
