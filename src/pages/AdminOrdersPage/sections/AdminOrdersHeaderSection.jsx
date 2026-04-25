export default function AdminOrdersHeaderSection() {
  return (
    <div className="mb-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-[var(--admin-text)]">Quản lý đơn hàng</h1>
        <p className="text-sm text-[var(--admin-text-muted)]">
          Theo dõi, tìm kiếm và quản lý tất cả đơn hàng của khách hàng.
        </p>
      </div>
    </div>
  )
}
