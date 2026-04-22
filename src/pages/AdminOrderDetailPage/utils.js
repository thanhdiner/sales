import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react'

export const ADMIN_ORDER_DETAIL_STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' }
]

const ORDER_STATUS_INFO = {
  pending: {
    label: 'Chờ xác nhận',
    color: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900/60 dark:bg-yellow-900/20 dark:text-yellow-300',
    icon: Clock
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-300',
    icon: CheckCircle
  },
  shipping: {
    label: 'Đang giao',
    color: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/60 dark:bg-purple-900/20 dark:text-purple-300',
    icon: Truck
  },
  completed: {
    label: 'Hoàn thành',
    color: 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-300',
    icon: CheckCircle
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300',
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
