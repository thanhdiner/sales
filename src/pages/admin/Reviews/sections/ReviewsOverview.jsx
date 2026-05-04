import { MessageCircleReply, MessageCircleX, Star, StarHalf, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StatCard, StatGrid } from '@/components/admin/ui'

export default function ReviewsOverview({ stats, replyRate, ratingFilter, onRatingFilterChange }) {
  const { t } = useTranslation('adminReviews')

  return (
    <>
      <StatGrid columns={4}>
        <StatCard label={t('stats.total')} value={stats.total} meta={t('stats.totalSub')} icon={Star} />
        <StatCard label={t('stats.average')} value={stats.avg} meta={t('stats.averageSub')} icon={StarHalf} />
        <StatCard label={t('stats.replied')} value={stats.replied} meta={t('stats.replyRate', { rate: replyRate })} icon={MessageCircleReply} />
        <StatCard label={t('stats.unreplied')} value={stats.total - stats.replied} meta={t('stats.unrepliedSub')} icon={MessageCircleX} />
      </StatGrid>

      {stats.total > 0 && (
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">{t('stats.distribution')}</p>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = stats.dist[star] || 0
              const percent = stats.total ? (count / stats.total) * 100 : 0
              const isActive = ratingFilter === String(star)

              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => onRatingFilterChange(isActive ? '' : String(star))}
                  className="group flex w-full items-center gap-2"
                >
                  <div className="flex min-w-[42px] items-center gap-1">
                    <span className="text-xs text-[var(--admin-text-muted)]">{star}</span>
                    <Star size={11} strokeWidth={1.8} className="fill-amber-400 text-amber-400" />
                  </div>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--admin-surface-3)]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isActive ? 'bg-[var(--admin-accent)]' : 'bg-[var(--admin-border-strong)]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="min-w-[28px] text-right text-xs text-[var(--admin-text-subtle)]">{count}</span>
                </button>
              )
            })}
          </div>

          {ratingFilter && (
            <button
              type="button"
              onClick={() => onRatingFilterChange('')}
              className="mt-3 flex items-center gap-1 text-xs font-medium text-[var(--admin-text-muted)] transition-colors hover:text-[var(--admin-text)]"
            >
              <X size={11} strokeWidth={1.8} />
              {t('stats.clearRating', { rating: ratingFilter })}
            </button>
          )}
        </div>
      )}
    </>
  )
}
