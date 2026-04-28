import { cn } from '@/lib/utils'

export default function AdminFormSection({
  children,
  className,
  description,
  extra,
  title
}) {
  const hasHeader = Boolean(title || description || extra)

  return (
    <section className={cn('admin-form-section', className)}>
      {hasHeader ? (
        <div className="admin-form-section__header">
          <div>
            {title ? <h3 className="admin-form-section__title">{title}</h3> : null}
            {description ? <p className="admin-form-section__description">{description}</p> : null}
          </div>
          {extra}
        </div>
      ) : null}

      {children}
    </section>
  )
}
