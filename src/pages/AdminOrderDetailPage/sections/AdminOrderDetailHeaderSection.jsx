import { Select } from 'antd'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import {
  ADMIN_ORDER_DETAIL_STATUS_OPTIONS,
  getAdminOrderDetailCode,
  getAdminOrderDetailStatusInfo
} from '../utils'

export default function AdminOrderDetailHeaderSection({
  order,
  status,
  updating,
  successMessage,
  onBack,
  onStatusChange,
  onUpdateStatus
}) {
  const statusInfo = getAdminOrderDetailStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="mb-5">
      <button
        type="button"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách đơn hàng
      </button>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Đơn hàng {getAdminOrderDetailCode(order._id)}
          </h1>

          <div
            className={`mt-3 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${statusInfo.color}`}
          >
            <StatusIcon className="h-4 w-4" />
            {statusInfo.label}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              value={status}
              onChange={onStatusChange}
              style={{ minWidth: 180, fontFamily: 'inherit' }}
              className="font-sans text-gray-700"
              options={ADMIN_ORDER_DETAIL_STATUS_OPTIONS}
            />

            <button
              type="button"
              disabled={updating || status === order.status}
              onClick={onUpdateStatus}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              {updating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-gray-300 dark:border-t-gray-900" />
                  Đang lưu...
                </>
              ) : (
                'Cập nhật'
              )}
            </button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/60 dark:bg-green-900/20">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">{successMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}
