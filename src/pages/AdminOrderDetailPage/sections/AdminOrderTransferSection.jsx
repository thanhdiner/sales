import { CreditCard } from 'lucide-react'

export default function AdminOrderTransferSection({ transferInfo }) {
  if (!transferInfo?.bank) {
    return null
  }

  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)]">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--admin-text)]">
        <CreditCard className="h-5 w-5 text-[var(--admin-text-muted)]" />
        Thông tin chuyển khoản
      </h2>

      <div className="space-y-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--admin-text-subtle)]">Ngân hàng</p>
          <p className="font-medium text-[var(--admin-text)]">{transferInfo.bank}</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--admin-text-subtle)]">Số tài khoản</p>
          <p className="font-mono font-medium text-[var(--admin-text)]">{transferInfo.accountNumber}</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--admin-text-subtle)]">Chủ tài khoản</p>
          <p className="font-medium text-[var(--admin-text)]">{transferInfo.accountName}</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--admin-text-subtle)]">Nội dung chuyển khoản</p>
          <p className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-2 font-mono text-sm font-medium text-[var(--admin-text)]">
            {transferInfo.content}
          </p>
        </div>
      </div>
    </div>
  )
}
