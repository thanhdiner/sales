import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react'

export const ADMIN_ORDER_DETAIL_STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' }
]

export const ADMIN_ORDER_PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Chưa thanh toán' },
  { value: 'paid', label: 'Đã thanh toán' },
  { value: 'failed', label: 'Thanh toán thất bại' }
]

const ORDER_STATUS_INFO = {
  pending: {
    label: 'Chờ xác nhận',
    color: 'border border-[color-mix(in_srgb,#f59e0b_36%,var(--admin-border))] bg-[color-mix(in_srgb,#f59e0b_16%,var(--admin-surface-2))] text-[#b45309] dark:text-[#fbbf24]',
    icon: Clock
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: 'border border-[color-mix(in_srgb,#3b82f6_32%,var(--admin-border))] bg-[color-mix(in_srgb,#3b82f6_16%,var(--admin-surface-2))] text-[#1d4ed8] dark:text-[#93c5fd]',
    icon: CheckCircle
  },
  shipping: {
    label: 'Đang giao',
    color: 'border border-[color-mix(in_srgb,#8b5cf6_34%,var(--admin-border))] bg-[color-mix(in_srgb,#8b5cf6_16%,var(--admin-surface-2))] text-[#6d28d9] dark:text-[#c4b5fd]',
    icon: Truck
  },
  completed: {
    label: 'Hoàn thành',
    color: 'border border-[color-mix(in_srgb,#22c55e_32%,var(--admin-border))] bg-[color-mix(in_srgb,#22c55e_16%,var(--admin-surface-2))] text-[#15803d] dark:text-[#4ade80]',
    icon: CheckCircle
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'border border-[color-mix(in_srgb,#ef4444_30%,var(--admin-border))] bg-[color-mix(in_srgb,#ef4444_14%,var(--admin-surface-2))] text-[#b91c1c] dark:text-[#fca5a5]',
    icon: XCircle
  }
}

export function getAdminOrderDetailStatusInfo(status) {
  return ORDER_STATUS_INFO[status] || ORDER_STATUS_INFO.pending
}

export function getAdminOrderDetailCode(orderId) {
  return `#${String(orderId || '').slice(-6).toUpperCase()}`
}

export function formatAdminOrderDetailCurrency(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')}₫`
}

export function getAdminOrderItemThumbnail(item) {
  return (
    item?.image ||
    item?.thumbnail ||
    item?.product?.image ||
    item?.product?.thumbnail ||
    item?.productId?.image ||
    item?.productId?.thumbnail ||
    ''
  )
}

export function getAdminOrderItemKey(item) {
  return item?.productId?._id || item?.product?._id || item?.productId || item?._id || item?.name
}

export function getAdminOrderItemFallbackIcon() {
  return Package
}
