import { CheckCircle, Circle, Clock } from 'lucide-react'

const STATUS_MAP = {
  unassigned: {
    label: 'Chờ xử lý',
    className:
      'border border-[color-mix(in_srgb,#f59e0b_30%,var(--admin-border))] bg-[color-mix(in_srgb,#f59e0b_14%,var(--admin-surface-2))] text-[#b45309] dark:text-[#fbbf24]',
    icon: Clock
  },
  open: {
    label: 'Đang mở',
    className:
      'border border-[color-mix(in_srgb,#3b82f6_32%,var(--admin-border))] bg-[color-mix(in_srgb,#3b82f6_16%,var(--admin-surface-2))] text-[#1d4ed8] dark:text-[#93c5fd]',
    icon: Circle
  },
  resolved: {
    label: 'Đã giải quyết',
    className:
      'border border-[color-mix(in_srgb,#22c55e_30%,var(--admin-border))] bg-[color-mix(in_srgb,#22c55e_14%,var(--admin-surface-2))] text-[#15803d] dark:text-[#4ade80]',
    icon: CheckCircle
  }
}

export default function StatusBadge({ status, compact = false }) {
  const currentStatus = STATUS_MAP[status] || STATUS_MAP.unassigned
  const Icon = currentStatus.icon
  const iconClassName = Icon === Circle ? 'h-3 w-3 fill-current' : 'h-3 w-3'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${currentStatus.className} ${
        compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'
      }`}
    >
      <Icon className={iconClassName} strokeWidth={1.8} />
      {currentStatus.label}
    </span>
  )
}
