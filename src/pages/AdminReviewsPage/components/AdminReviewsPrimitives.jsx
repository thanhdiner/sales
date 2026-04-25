import { Star } from 'lucide-react'

export function AdminReviewsStarDisplay({ value, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={size}
          strokeWidth={1.8}
          className={
            star <= Math.round(Number(value) || 0)
              ? 'fill-amber-400 text-amber-400'
              : 'text-[var(--admin-border-strong)]'
          }
        />
      ))}
    </div>
  )
}

export function AdminReviewsAvatar({ user }) {
  const name = user?.fullName || user?.username || '?'
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={name}
        className="h-9 w-9 flex-shrink-0 rounded-full border border-[var(--admin-border)] object-cover"
      />
    )
  }

  return (
    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--admin-surface-2)] text-xs font-semibold text-[var(--admin-text)]">
      {initials}
    </div>
  )
}

export function AdminReviewsRatingBadge({ rating }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface)] px-2 py-0.5 text-xs font-semibold text-[var(--admin-text)]">
      <Star size={10} strokeWidth={1.8} className="fill-amber-400 text-amber-400" />
      {rating}
    </span>
  )
}
