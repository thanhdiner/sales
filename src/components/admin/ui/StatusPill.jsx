import { Tag } from 'antd'
import { cn } from '@/utils/cn'

export default function StatusPill({
  children,
  className,
  dot = true,
  icon,
  label,
  tone = 'neutral'
}) {
  const content = label ?? children

  return (
    <Tag icon={icon || (dot ? <span className="admin-status-pill__dot" /> : undefined)} className={cn('admin-status-pill', `admin-status-pill--${tone}`, className)}>
      {content}
    </Tag>
  )
}
