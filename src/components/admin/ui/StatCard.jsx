import { isValidElement } from 'react'
import { cn } from '@/utils/cn'

function renderIcon(icon) {
  if (!icon) return null

  if (isValidElement(icon)) return icon

  const Icon = icon
  return <Icon className="h-5 w-5" strokeWidth={1.8} />
}

export function AdminStatGrid({ children, className, columns, ...props }) {
  return (
    <div className={cn('admin-stat-grid', className)} style={columns ? { '--admin-stat-grid-columns': columns } : undefined} {...props}>
      {children}
    </div>
  )
}

export default function AdminStatCard({ className, icon, label, meta, tone = 'default', value }) {
  const hasValue = value !== undefined && value !== null && value !== ''

  return (
    <article className={cn('admin-stat-card', tone !== 'default' && `admin-stat-card--${tone}`, className)}>
      <div className="admin-stat-card__content">
        <p className="admin-stat-card__label">{label}</p>
        {hasValue ? <p className="admin-stat-card__value">{value}</p> : null}
        {meta ? <p className="admin-stat-card__meta">{meta}</p> : null}
      </div>

      {icon ? <span className="admin-stat-card__icon">{renderIcon(icon)}</span> : null}
    </article>
  )
}
