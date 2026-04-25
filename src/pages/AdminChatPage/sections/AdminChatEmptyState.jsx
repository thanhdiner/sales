import { MessageCircle } from 'lucide-react'

export default function AdminChatEmptyState() {
  return (
    <div className="hidden flex-1 items-center justify-center bg-[var(--admin-bg-soft)] md:flex">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-subtle)] shadow-[var(--admin-shadow)]">
          <MessageCircle className="h-8 w-8" strokeWidth={1.8} />
        </div>

        <h3 className="mb-1 text-base font-semibold text-[var(--admin-text)]">
          Chọn cuộc trò chuyện
        </h3>
        <p className="text-sm text-[var(--admin-text-muted)]">
          Chọn một hội thoại từ danh sách để xem lịch sử và phản hồi khách hàng.
        </p>
      </div>
    </div>
  )
}
