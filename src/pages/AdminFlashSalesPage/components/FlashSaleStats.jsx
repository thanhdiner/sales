import { Clock, ShoppingCart, Tag, TrendingUp } from 'lucide-react'
import { formatCurrency, getFlashSaleStats } from '../utils/flashSaleHelpers'

const statCards = [
  {
    key: 'totalRevenue',
    title: 'Tổng doanh thu',
    icon: TrendingUp,
    formatValue: value => formatCurrency(value)
  },
  {
    key: 'activeSales',
    title: 'Sale đang diễn ra',
    icon: Clock
  },
  {
    key: 'totalProductsSold',
    title: 'Tổng sản phẩm bán',
    icon: ShoppingCart
  },
  {
    key: 'totalPrograms',
    title: 'Tổng chương trình',
    icon: Tag
  }
]

export default function FlashSaleStats({ flashSales }) {
  const stats = getFlashSaleStats(flashSales)

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map(card => {
        const Icon = card.icon
        const value = stats[card.key]

        return (
          <div
            key={card.key}
            className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--admin-text-muted)]">
                  {card.title}
                </p>

                <p className="mt-2 text-2xl font-semibold text-[var(--admin-text)]">
                  {card.formatValue ? card.formatValue(value) : value}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)]">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
