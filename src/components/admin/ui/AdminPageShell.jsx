import { Card } from 'antd'
import SEO from '@/components/SEO'
import { cn } from '@/lib/utils'

export default function AdminPageShell({
  children,
  className,
  contentClassName,
  maxWidth = '1320px',
  noIndex = true,
  panel = false,
  panelClassName,
  seoTitle
}) {
  const content = panel ? (
    <Card className={cn('admin-page-shell__panel', panelClassName)}>{children}</Card>
  ) : (
    children
  )

  return (
    <div className={cn('admin-page-shell', className)}>
      {seoTitle ? <SEO title={seoTitle} noIndex={noIndex} /> : null}

      <div className={cn('admin-page-shell__inner', contentClassName)} style={{ '--admin-page-shell-max-width': maxWidth }}>
        {content}
      </div>
    </div>
  )
}
