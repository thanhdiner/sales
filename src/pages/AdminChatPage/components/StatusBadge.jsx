import { CheckCircle, Circle, Clock } from 'lucide-react'

const STATUS_MAP = {
  unassigned: {
    label: 'Chờ xử lý',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    icon: Clock
  },
  open: {
    label: 'Đang mở',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: Circle
  },
  resolved: {
    label: 'Đã giải quyết',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle
  }
}

export default function StatusBadge({ status }) {
  const currentStatus = STATUS_MAP[status] || STATUS_MAP.unassigned
  const Icon = currentStatus.icon
  const iconClassName = Icon === Circle ? 'w-3 h-3 fill-current' : 'w-3 h-3'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${currentStatus.className}`}>
      <Icon className={iconClassName} />
      {currentStatus.label}
    </span>
  )
}
