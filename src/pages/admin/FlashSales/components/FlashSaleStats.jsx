import { Clock, ShoppingCart, Tag, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StatCard, StatGrid } from '@/components/admin/ui'
import { formatCurrency, getFlashSaleStats, getFlashSalesLocale } from '../utils/flashSaleHelpers'

const iconProps = {
  className: 'h-5 w-5',
  strokeWidth: 1.8
}

const statCards = [
  {
    key: 'totalRevenue',
    titleKey: 'stats.totalRevenue',
    metaKey: 'stats.totalRevenueHint',
    icon: <TrendingUp {...iconProps} />,
    formatValue: (value, locale) => formatCurrency(value, locale)
  },
  {
    key: 'activeSales',
    titleKey: 'stats.activeSales',
    metaKey: 'stats.activeSalesHint',
    icon: <Clock {...iconProps} />
  },
  {
    key: 'totalProductsSold',
    titleKey: 'stats.totalProductsSoldHint',
    metaKey: 'stats.totalProductsSoldHint',
    icon: <ShoppingCart {...iconProps} />
  },
  {
    key: 'totalPrograms',
    titleKey: 'stats.totalPrograms',
    metaKey: 'stats.totalProgramsHint',
    icon: <Tag {...iconProps} />
  }
]

export default function FlashSaleStats({ flashSales }) {
  const { t, i18n } = useTranslation('adminFlashSales')
  const locale = getFlashSalesLocale(i18n.language)
  const stats = getFlashSaleStats(flashSales)

  return (
    <StatGrid className="admin-flash-sales-stats mb-6" columns={4}>
      {statCards.map(card => {
        const value = stats[card.key]

        return (
          <StatCard
            key={card.key}
            className="admin-flash-sales-stat-card"
            label={t(card.titleKey)}
            value={card.formatValue ? card.formatValue(value, locale) : value}
            meta={t(card.metaKey)}
            icon={card.icon}
          />
        )
      })}
    </StatGrid>
  )
}
