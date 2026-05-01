import React, { useState } from 'react'
import { Button, Modal, message } from 'antd'
import { AlertCircle, Copy, Eye, EyeOff, KeyRound, Link as LinkIcon, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'

const FIELD_CONFIG = [
  { key: 'username', label: 'Tên đăng nhập', Icon: UserRound },
  { key: 'password', label: 'Mật khẩu', Icon: LockKeyhole, secret: true },
  { key: 'email', label: 'Email', Icon: Mail },
  { key: 'licenseKey', label: 'Key / Mã kích hoạt', Icon: KeyRound },
  { key: 'loginUrl', label: 'Link đăng nhập', Icon: LinkIcon, isLink: true },
  { key: 'instructions', label: 'Hướng dẫn', Icon: ShieldCheck, multiline: true },
  { key: 'notes', label: 'Ghi chú', Icon: ShieldCheck, multiline: true }
]

const getDigitalDeliveries = order =>
  (order?.orderItems || [])
    .flatMap(item => (item.digitalDeliveries || []).map((delivery, index) => ({
      ...delivery,
      productName: item.name,
      index: index + 1
    })))
    .filter(delivery => FIELD_CONFIG.some(field => delivery[field.key]))

const AccountFieldCard = ({ label, value, Icon, multiline, isLink, secret }) => {
  const [visible, setVisible] = useState(!secret)
  const displayValue = secret && !visible ? '••••••••' : value

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      message.success(`Đã sao chép ${label.toLowerCase()}.`)
    } catch {
      message.error('Không thể sao chép dữ liệu.')
    }
  }

  return (
    <div className={`rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40 ${multiline ? 'sm:col-span-2' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</p>
            {isLink ? (
              <a href={value} target="_blank" rel="noreferrer" className="mt-1 block break-all text-sm leading-6 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                {displayValue}
              </a>
            ) : (
              <p className={`mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300 ${multiline ? 'whitespace-pre-wrap' : 'break-all'}`}>
                {displayValue}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-1">
          {secret && (
            <button type="button" onClick={() => setVisible(prev => !prev)} className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          <button type="button" onClick={handleCopy} className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" aria-label={`Sao chép ${label}`}>
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OrderAccountInfoModal({ open, order, orderCode, onClose, onContactSupport }) {
  const deliveries = getDigitalDeliveries(order)
  const canView = order?.paymentStatus === 'paid'

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={760} title="Thông tin tài khoản" destroyOnClose>
      <div className="space-y-5 pt-2">
        {canView && deliveries.length > 0 ? (
          <>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Dữ liệu bàn giao đã sẵn sàng</p>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                Đây là thông tin tài khoản/license của đơn #{orderCode}. Hãy lưu lại cẩn thận và đổi mật khẩu nếu cần.
              </p>
            </div>

            {deliveries.map((delivery, deliveryIndex) => (
              <div key={`${delivery.credentialId || deliveryIndex}`} className="space-y-3 rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {delivery.productName} {delivery.index ? `#${delivery.index}` : ''}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {FIELD_CONFIG.filter(field => delivery[field.key]).map(field => (
                    <AccountFieldCard
                      key={field.key}
                      label={field.label}
                      value={delivery[field.key]}
                      Icon={field.Icon}
                      multiline={field.multiline || String(delivery[field.key]).includes('\n')}
                      isLink={field.isLink}
                      secret={field.secret}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <Button onClick={onClose}>Đóng</Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-amber-600 dark:bg-gray-900 dark:text-amber-300">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Thông tin tài khoản chưa sẵn sàng</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {canView ? 'Đơn đã thanh toán nhưng chưa có dữ liệu bàn giao. Vui lòng liên hệ shop để kiểm tra.' : 'Thông tin tài khoản sẽ hiển thị sau khi đơn hàng được thanh toán.'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={onClose}>Đóng</Button>
              <Button type="primary" onClick={onContactSupport}>Liên hệ hỗ trợ</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
