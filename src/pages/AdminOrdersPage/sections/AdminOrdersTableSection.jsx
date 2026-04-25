import { Eye, Package } from 'lucide-react'
import {
  formatAdminOrderDate,
  formatAdminOrderTotal,
  getAdminOrderCode,
  getAdminOrderCustomerName,
  getAdminOrderStatusConfig
} from '../utils'

function AdminOrdersLoadingState() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--admin-border)] border-t-[var(--admin-accent)]" />
        <p className="text-sm font-medium text-[var(--admin-text-muted)]">Đang tải dữ liệu...</p>
      </div>
    </div>
  )
}

function AdminOrdersEmptyState() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[var(--admin-text-subtle)]">
          <Package className="h-6 w-6" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-[var(--admin-text)]">Không có đơn hàng nào</h3>
        <p className="text-sm text-[var(--admin-text-muted)]">Chưa có đơn hàng nào phù hợp với bộ lọc hiện tại.</p>
      </div>
    </div>
  )
}

function AdminOrdersTableRow({ order, onViewOrder }) {
  const statusConfig = getAdminOrderStatusConfig(order.status)
  const StatusIcon = statusConfig.icon

  return (
    <div
      className="group cursor-pointer px-4 py-4 transition-colors hover:bg-[var(--admin-surface-2)] md:px-5"
      onClick={() => onViewOrder(order._id)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center md:gap-4">
        <div className="md:col-span-2">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-text-subtle)] md:hidden">Mã đơn</div>
          <div className="inline-flex rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--admin-text)]">
            {getAdminOrderCode(order._id)}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-text-subtle)] md:hidden">Khách hàng</div>
          <div className="truncate text-sm font-medium text-[var(--admin-text)]">{getAdminOrderCustomerName(order)}</div>
        </div>

        <div className="md:col-span-2">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-text-subtle)] md:hidden">Liên hệ</div>
          <div className="text-sm text-[var(--admin-text-muted)]">{order.contact?.phone || '--'}</div>
        </div>

        <div className="md:col-span-2">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-text-subtle)] md:hidden">Ngày tạo</div>
          <div className="text-sm text-[var(--admin-text-muted)]">{formatAdminOrderDate(order.createdAt)}</div>
        </div>

        <div className="md:col-span-2">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-text-subtle)] md:hidden">Trạng thái</div>
          <div
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${statusConfig.badgeClassName}`}
          >
            <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.iconClassName}`} />
            {statusConfig.label}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-text-subtle)] md:hidden">Tổng tiền</div>
          <div className="text-sm font-semibold text-[var(--admin-text)]">{formatAdminOrderTotal(order.total)}</div>
        </div>

        <div className="text-left md:col-span-1 md:text-center">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-text-subtle)] md:hidden">Thao tác</div>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)] transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]"
            onClick={event => {
              event.stopPropagation()
              onViewOrder(order._id)
            }}
            aria-label="Xem chi tiết đơn hàng"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminOrdersTableSection({ loading, orders, onViewOrder }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)]">
      {loading ? (
        <AdminOrdersLoadingState />
      ) : orders.length === 0 ? (
        <AdminOrdersEmptyState />
      ) : (
        <>
          <div className="hidden border-b border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-5 py-3 md:block">
            <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">
              <div className="col-span-2">Mã đơn</div>
              <div className="col-span-2">Khách hàng</div>
              <div className="col-span-2">Liên hệ</div>
              <div className="col-span-2">Ngày tạo</div>
              <div className="col-span-2">Trạng thái</div>
              <div className="col-span-1">Tổng tiền</div>
              <div className="col-span-1 text-center">Thao tác</div>
            </div>
          </div>

          <div className="divide-y divide-[var(--admin-border)]">
            {orders.map(order => (
              <AdminOrdersTableRow key={order._id} order={order} onViewOrder={onViewOrder} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
