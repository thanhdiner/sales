import { Modal, Tag } from 'antd'
import dayjs from 'dayjs'
import { formatCurrency, getPromoCodeStatusMeta } from '../utils/promoCodeHelpers'

export default function PromoCodeDetailModal({ open, selectedCode, onCancel }) {
  const statusMeta = selectedCode ? getPromoCodeStatusMeta(selectedCode) : null

  return (
    <Modal
      title={<span className="dark:text-white">Chi tiết mã giảm giá</span>}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      {selectedCode && (
        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-gray-800 dark:outline dark:outline-2 dark:outline-gray-700">
            <div className="text-center">
              <h3 className="font-mono text-xl font-bold text-blue-600 dark:text-white">{selectedCode.code}</h3>
              <p className="mt-1 text-gray-600 dark:text-white">
                {selectedCode.discountType === 'percent'
                  ? `Giảm ${selectedCode.discountValue}%`
                  : `Giảm ${formatCurrency(selectedCode.discountValue)}`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-white">Đơn tối thiểu</label>
              <p className="text-gray-800 dark:text-white">{formatCurrency(selectedCode.minOrder)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-white">Giảm tối đa</label>
              <p className="text-gray-800 dark:text-white">
                {selectedCode.maxDiscount ? formatCurrency(selectedCode.maxDiscount) : 'Không giới hạn'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-white">Đã sử dụng</label>
              <p className="text-gray-800 dark:text-white">
                {selectedCode.usedCount} / {selectedCode.usageLimit || '∞'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-white">Hết hạn</label>
              <p className="text-gray-800 dark:text-white">
                {selectedCode.expiresAt ? dayjs(selectedCode.expiresAt).format('DD/MM/YYYY HH:mm') : 'Không giới hạn'}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-white">Trạng thái</label>
            <div className="mt-1">{statusMeta && <Tag color={statusMeta.color}>{statusMeta.label}</Tag>}</div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-white">Ngày tạo</label>
            <p className="text-gray-800 dark:text-white">{dayjs(selectedCode.createdAt).format('DD/MM/YYYY HH:mm')}</p>
          </div>
        </div>
      )}
    </Modal>
  )
}
