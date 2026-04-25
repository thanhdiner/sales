import { Modal, Tag } from 'antd'
import dayjs from 'dayjs'
import { formatCurrency, getPromoCodeStatusMeta } from '../utils/promoCodeHelpers'

export default function PromoCodeDetailModal({ open, selectedCode, onCancel }) {
  const statusMeta = selectedCode ? getPromoCodeStatusMeta(selectedCode) : null

  return (
    <Modal
      title={<span className="text-[var(--admin-text)]">Chi tiết mã giảm giá</span>}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
      className="admin-promo-detail-modal"
    >
      {selectedCode && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-4">
            <div className="text-center">
              <h3 className="font-mono text-xl font-bold text-[var(--admin-accent)]">{selectedCode.code}</h3>
              <p className="mt-1 text-[var(--admin-text-muted)]">
                {selectedCode.discountType === 'percent'
                  ? `Giảm ${selectedCode.discountValue}%`
                  : `Giảm ${formatCurrency(selectedCode.discountValue)}`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[var(--admin-text-muted)]">Đơn tối thiểu</label>
              <p className="text-[var(--admin-text)]">{formatCurrency(selectedCode.minOrder)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--admin-text-muted)]">Giảm tối đa</label>
              <p className="text-[var(--admin-text)]">
                {selectedCode.maxDiscount ? formatCurrency(selectedCode.maxDiscount) : 'Không giới hạn'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--admin-text-muted)]">Đã sử dụng</label>
              <p className="text-[var(--admin-text)]">
                {selectedCode.usedCount} / {selectedCode.usageLimit || '∞'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--admin-text-muted)]">Hết hạn</label>
              <p className="text-[var(--admin-text)]">
                {selectedCode.expiresAt ? dayjs(selectedCode.expiresAt).format('DD/MM/YYYY HH:mm') : 'Không giới hạn'}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--admin-text-muted)]">Trạng thái</label>
            <div className="mt-1">{statusMeta && <Tag color={statusMeta.color}>{statusMeta.label}</Tag>}</div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--admin-text-muted)]">Ngày tạo</label>
            <p className="text-[var(--admin-text)]">{dayjs(selectedCode.createdAt).format('DD/MM/YYYY HH:mm')}</p>
          </div>
        </div>
      )}
    </Modal>
  )
}
