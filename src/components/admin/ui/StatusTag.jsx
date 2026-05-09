import { Tag } from 'antd'
import { cn } from '@/utils/cn'

const STATUS_TAG_COLORS = {
  active: 'green',
  success: 'green',
  scheduled: 'blue',
  info: 'blue',
  warning: 'gold',
  danger: 'volcano',
  error: 'volcano',
  disabled: 'default',
  inactive: 'volcano',
  neutral: 'default',
  default: 'default'
}

export default function StatusTag({ children, className, color, label, tone = 'default', ...props }) {
  const statusTone = tone || 'default'

  return (
    <Tag {...props} color={color ?? STATUS_TAG_COLORS[statusTone] ?? 'default'} className={cn('admin-status-tag', `admin-status-tag--${statusTone}`, className)}>
      {label ?? children}
    </Tag>
  )
}
