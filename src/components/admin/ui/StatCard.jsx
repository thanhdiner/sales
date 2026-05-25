import { cn } from '@/utils/cn'

export function StatGrid({ children, className, columns, ...props }) {
  return (
    <div className={cn('admin-stat-grid', className)} style={columns ? { '--admin-stat-grid-columns': columns } : undefined} {...props}>
      {children}
    </div>
  )
}

export default function StatCard({ className, icon, label, meta, tone = 'default', value }) {
  const hasValue = value !== undefined && value !== null && value !== ''

  return (
    <article className={cn('admin-stat-card', tone !== 'default' && `admin-stat-card--${tone}`, className)}>
      <div className="admin-stat-card__content">
        <p className="admin-stat-card__label">{label}</p>
        {hasValue && <p className="admin-stat-card__value">{value}</p>}
        {meta && <p className="admin-stat-card__meta">{meta}</p>}
      </div>

      {icon && <span className="admin-stat-card__icon">{icon}</span>}
    </article>
  )
}
