import { cn } from '@/lib/utils'

export default function AdminCard({
  as: Component = 'section',
  bodyClassName,
  children,
  className,
  description,
  extra,
  headerClassName,
  title,
  titleLevel = 2,
  ...props
}) {
  const hasHeader = Boolean(title || description || extra)
  const hasBody = children !== undefined && children !== null && children !== false
  const TitleTag = `h${Math.min(6, Math.max(1, Number(titleLevel) || 2))}`

  return (
    <Component className={cn('admin-card', className)} {...props}>
      {hasHeader ? (
        <div className={cn('admin-card__header', headerClassName)}>
          <div className="admin-card__heading">
            {title ? <TitleTag className="admin-card__title">{title}</TitleTag> : null}
            {description ? <p className="admin-card__description">{description}</p> : null}
          </div>

          {extra ? <div className="admin-card__extra">{extra}</div> : null}
        </div>
      ) : null}

      {hasBody ? <div className={cn('admin-card__body', bodyClassName)}>{children}</div> : null}
    </Component>
  )
}
