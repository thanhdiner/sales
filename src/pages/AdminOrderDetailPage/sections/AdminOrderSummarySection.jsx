import { formatAdminOrderDetailCurrency } from '../utils'

export default function AdminOrderSummarySection({ order }) {
  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)]">
      <h2 className="mb-4 text-base font-semibold text-[var(--admin-text)]">Tổng quan đơn hàng</h2>

      <div className="space-y-3">
        <div className="flex justify-between text-sm text-[var(--admin-text-muted)]">
          <span>Thanh toán</span>
          <span>{order.paymentStatus === 'paid' ? 'Đã thanh toán' : order.paymentStatus === 'failed' ? 'Thanh toán thất bại' : 'Chưa thanh toán'}</span>
        </div>

        <div className="flex justify-between text-sm text-[var(--admin-text-muted)]">
          <span>Tạm tính</span>
          <span>{formatAdminOrderDetailCurrency(order.subtotal)}</span>
        </div>

        {order.discount > 0 && (
          <div className="flex justify-between text-sm text-[#16a34a] dark:text-[#4ade80]">
            <span>Giảm giá</span>
            <span>-{formatAdminOrderDetailCurrency(order.discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm text-[var(--admin-text-muted)]">
          <span>Phí vận chuyển</span>
          <span>{order.shipping === 0 ? 'Miễn phí' : formatAdminOrderDetailCurrency(order.shipping)}</span>
        </div>

        <div className="border-t border-[var(--admin-border)] pt-3">
          <div className="flex justify-between text-base font-semibold text-[var(--admin-text)]">
            <span>Tổng cộng</span>
            <span>{formatAdminOrderDetailCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
