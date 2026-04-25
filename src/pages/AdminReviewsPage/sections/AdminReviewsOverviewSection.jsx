import { Star, X } from 'lucide-react'

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)]">
      <p className="text-xs font-medium text-[var(--admin-text-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-[var(--admin-text)]">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-[var(--admin-text-subtle)]">{sub}</p>}
    </div>
  )
}

export default function AdminReviewsOverviewSection({
  stats,
  replyRate,
  ratingFilter,
  onRatingFilterChange
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Tổng đánh giá" value={stats.total} sub="tất cả sản phẩm" />
        <StatCard label="Điểm trung bình" value={stats.avg} sub="trên thang 5 sao" />
        <StatCard label="Đã phản hồi" value={stats.replied} sub={`${replyRate}% tỷ lệ phản hồi`} />
        <StatCard label="Chưa phản hồi" value={stats.total - stats.replied} sub="cần xử lý" />
      </div>

      {stats.total > 0 && (
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">
            Phân bổ đánh giá
          </p>

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
              Bỏ lọc {ratingFilter} sao
            </button>
          )}
        </div>
      )}
    </>
  )
}
