export default function AdminOrderDetailLoadingState() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--admin-border)] border-t-[var(--admin-accent)]" />
      <p className="text-sm font-medium text-[var(--admin-text-muted)]">Đang tải đơn hàng...</p>
    </div>
  )
}
