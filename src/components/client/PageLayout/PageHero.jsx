import { cn } from '@/utils/cn'
import './PageLayout.scss'

export default function PageHero({
  actions,
  align = 'center',
  badges = [],
  children,
  className,
  contentClassName,
  description,
  eyebrow,
  title
}) {
  const badgeItems = badges.filter(Boolean)

  return (
    <header className={cn('page-hero', align === 'left' && 'page-hero--left', className)}>
      <div className={cn('page-hero__content', contentClassName)}>
        {eyebrow ? <p className="page-hero__eyebrow">{eyebrow}</p> : null}
        {title ? <h1 className="page-hero__title">{title}</h1> : null}
        {description ? <p className="page-hero__description">{description}</p> : null}

        {badgeItems.length ? (
          <div className="page-hero__badges">
            {badgeItems.map((badge, index) => (
              <span key={`${badge}-${index}`} className="page-hero__badge">
                {badge}
              </span>
            ))}
          </div>
        ) : null}

        {actions ? <div className="page-hero__actions">{actions}</div> : null}
        {children}
      </div>
    </header>
  )
}
