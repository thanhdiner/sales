import { cn } from '@/lib/utils'
import './PageLayout.scss'

export default function ContentSection({
  as: Component = 'section',
  bodyClassName,
  children,
  className,
  description,
  headerClassName,
  id,
  title
}) {
  const hasHeader = Boolean(title || description)

  return (
    <Component id={id} className={cn('content-section', className)}>
      {hasHeader ? (
        <div className={cn('content-section__header', headerClassName)}>
          {title ? <h2 className="content-section__title">{title}</h2> : null}
          {description ? <p className="content-section__description">{description}</p> : null}
        </div>
      ) : null}

      <div className={cn('content-section__body', bodyClassName)}>{children}</div>
    </Component>
  )
}
