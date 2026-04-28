import { cn } from '@/lib/utils'

export default function AdminTablePanel({
  bodyClassName,
  children,
  className,
  description,
  extra,
  title
}) {
  const hasHeader = Boolean(title || description || extra)

  return (
    <section className={cn('admin-table-panel admin-table-shell', className)}>
      {hasHeader ? (
        <div className="admin-table-panel__header admin-table-shell__header">
          <div className="admin-table-panel__heading admin-table-shell__heading">
            {title ? <h2 className="admin-table-panel__title admin-table-shell__title">{title}</h2> : null}
            {description ? <p className="admin-table-panel__description admin-table-shell__description">{description}</p> : null}
          </div>

          {extra ? <div className="admin-table-panel__extra admin-table-shell__extra">{extra}</div> : null}
        </div>
      ) : null}

      <div className={cn('admin-table-panel__body admin-table-shell__body', bodyClassName)}>
        {children}
      </div>
    </section>
  )
}
