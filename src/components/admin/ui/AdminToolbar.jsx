import { Typography } from 'antd'
import { cn } from '@/lib/utils'

const { Text, Title } = Typography

export default function AdminToolbar({
  actions,
  children,
  className,
  contentClassName,
  description,
  title,
  titleLevel = 2
}) {
  return (
    <div className={cn('admin-toolbar', className)}>
      <div className={cn('admin-toolbar__content', contentClassName)}>
        {title ? (
          <Title level={titleLevel} className="admin-toolbar__title">
            {title}
          </Title>
        ) : null}

        {description ? <Text className="admin-toolbar__description">{description}</Text> : null}
        {children}
      </div>

      {actions ? <div className="admin-toolbar__actions">{actions}</div> : null}
    </div>
  )
}
