import {
  formatAdminOrderDetailCurrency,
  getAdminOrderItemFallbackIcon,
  getAdminOrderItemKey,
  getAdminOrderItemThumbnail
} from '../utils'

const FallbackIcon = getAdminOrderItemFallbackIcon()

export default function AdminOrderItemsSection({ orderItems = [] }) {
  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)]">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--admin-text)]">
        <FallbackIcon className="h-5 w-5 text-[var(--admin-text-muted)]" />
        Sản phẩm đã đặt
      </h2>

      <div className="space-y-3">
        {orderItems.map(item => {
          const thumbnail = getAdminOrderItemThumbnail(item)

          return (
            <div
              key={getAdminOrderItemKey(item)}
              className="flex items-center justify-between gap-4 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-4 transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-3)]"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
                  {thumbnail ? (
                    <img src={thumbnail} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <FallbackIcon className="h-6 w-6 text-[var(--admin-text-subtle)]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-[var(--admin-text)]">{item.name}</h3>
                  <p className="mt-1 text-sm text-[var(--admin-text-muted)]">{item.category}</p>
                  {item.digitalDeliveries?.length > 0 && (
                    <div className="mt-2 rounded-lg border border-[color-mix(in_srgb,#22c55e_30%,var(--admin-border))] bg-[color-mix(in_srgb,#22c55e_12%,var(--admin-surface-2))] p-2 text-xs text-[#15803d] dark:text-[#4ade80]">
                      Đã bàn giao {item.digitalDeliveries.length} tài khoản/license
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-medium text-[var(--admin-text)]">x{item.quantity}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--admin-text)]">
                  {formatAdminOrderDetailCurrency(item.price)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
