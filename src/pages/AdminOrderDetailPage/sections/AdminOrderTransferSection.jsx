import { CreditCard } from 'lucide-react'

export default function AdminOrderTransferSection({ transferInfo }) {
  if (!transferInfo?.bank) {
    return null
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
        <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        Thông tin chuyển khoản
      </h2>

      <div className="space-y-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Ngân hàng</p>
          <p className="font-medium text-gray-900 dark:text-white">{transferInfo.bank}</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Số tài khoản</p>
          <p className="font-mono font-medium text-gray-900 dark:text-white">{transferInfo.accountNumber}</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Chủ tài khoản</p>
          <p className="font-medium text-gray-900 dark:text-white">{transferInfo.accountName}</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Nội dung chuyển khoản</p>
          <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm font-medium text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            {transferInfo.content}
          </p>
        </div>
      </div>
    </div>
  )
}
