import React from 'react'
import { Button, Modal, message } from 'antd'
import { AlertCircle, Copy, KeyRound, Link as LinkIcon, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { getOrderStatusText } from '../utils'

const ACCOUNT_FIELD_CONFIG = [
  { label: 'Tên đăng nhập', keys: ['username', 'userName', 'login', 'loginName', 'accountName'], Icon: UserRound },
  { label: 'Mật khẩu', keys: ['password', 'pass', 'passwordText'], Icon: LockKeyhole },
  { label: 'Email', keys: ['email', 'loginEmail', 'accountEmail', 'emailLogin'], Icon: Mail },
  { label: 'Key / Mã kích hoạt', keys: ['key', 'licenseKey', 'accessKey', 'activationKey', 'serialKey'], Icon: KeyRound },
  { label: 'Link đăng nhập', keys: ['loginUrl', 'url', 'website'], Icon: LinkIcon },
  { label: 'Hướng dẫn đăng nhập', keys: ['instructions', 'instruction', 'guide', 'loginGuide', 'note', 'notes'], Icon: ShieldCheck, multiline: true },
]

const POSSIBLE_ACCOUNT_SOURCES = ['accountInfo', 'digitalAccount', 'accountCredentials', 'credentials', 'deliveryInfo', 'accessInfo']

const isPlainObject = value => Object.prototype.toString.call(value) === '[object Object]'

const normalizeValue = value => {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.map(item => normalizeValue(item)).filter(Boolean).join('\n')
  return ''
}

const findNestedValue = (source, keys, visited = new WeakSet()) => {
  if (!source || typeof source !== 'object') return ''
  if (visited.has(source)) return ''
  visited.add(source)

  if (Array.isArray(source)) {
    for (const item of source) {
      const found = findNestedValue(item, keys, visited)
      if (found) return found
    }
    return ''
  }

  for (const [key, value] of Object.entries(source)) {
    if (keys.includes(key.toLowerCase())) {
      const normalized = normalizeValue(value)
      if (normalized) return normalized
    }
  }

  for (const value of Object.values(source)) {
    if (isPlainObject(value) || Array.isArray(value)) {
      const found = findNestedValue(value, keys, visited)
      if (found) return found
    }
  }

  return ''
}

const extractAccountFields = order => {
  const sources = POSSIBLE_ACCOUNT_SOURCES
    .map(key => order?.[key])
    .filter(value => isPlainObject(value) || Array.isArray(value))

  return ACCOUNT_FIELD_CONFIG
    .map(field => {
      const value = sources.map(source => findNestedValue(source, field.keys.map(key => key.toLowerCase()))).find(Boolean)

      if (!value) return null

      return {
        label: field.label,
        value,
        Icon: field.Icon,
        multiline: field.multiline || value.includes('\n'),
        isLink: field.keys.includes('loginUrl') || field.keys.includes('url') || field.keys.includes('website'),
      }
    })
    .filter(Boolean)
}

const FallbackState = ({ order, orderCode, onContactSupport }) => {
  const statusText = getOrderStatusText(order?.status)
  const isReadyStatus = order?.status === 'shipping' || order?.status === 'completed'
  const isProblemStatus = order?.status === 'cancelled' || order?.paymentStatus === 'failed'

  let title = 'Thông tin tài khoản chưa sẵn sàng'
  let description = 'Shop đang xử lý đơn. Thông tin tài khoản sẽ xuất hiện tại đây sau khi bàn giao.'

  if (isReadyStatus) {
    title = 'Chưa có dữ liệu bàn giao trong đơn'
    description = 'Đơn đã được cập nhật bàn giao hoặc hoàn tất, nhưng hệ thống hiện chưa trả về username, password, email hay key trong chi tiết đơn hàng này.'
  } else if (isProblemStatus) {
    title = 'Đơn cần hỗ trợ thêm'
    description = 'Đơn này đang ở trạng thái cần hỗ trợ. Vui lòng liên hệ shop để kiểm tra lại thanh toán hoặc tiến trình bàn giao.'
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-amber-600 dark:bg-gray-900 dark:text-amber-300">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{description}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/40">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Mã đơn</p>
            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">#{orderCode}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Trạng thái</p>
            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{statusText}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="primary" onClick={onContactSupport}>
          Liên hệ hỗ trợ
        </Button>
      </div>
    </div>
  )
}

const AccountFieldCard = ({ label, value, Icon, multiline, isLink }) => {
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
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</p>
            {isLink ? (
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block break-all text-sm leading-6 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {value}
              </a>
            ) : (
              <p className={`mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300 ${multiline ? 'whitespace-pre-wrap' : 'break-all'}`}>
                {value}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          aria-label={`Sao chép ${label}`}
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default function OrderAccountInfoModal({ open, order, orderCode, onClose, onContactSupport }) {
  const accountFields = extractAccountFields(order)

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      title="Thông tin tài khoản"
      destroyOnClose
    >
      <div className="space-y-5 pt-2">
        {accountFields.length > 0 ? (
          <>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Dữ liệu bàn giao đã sẵn sàng</p>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                Đây là thông tin tài khoản được hệ thống trả về trong chi tiết đơn hàng #{orderCode}. Hãy lưu lại cẩn thận và đổi mật khẩu nếu cần.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {accountFields.map(field => (
                <AccountFieldCard
                  key={field.label}
                  label={field.label}
                  value={field.value}
                  Icon={field.Icon}
                  multiline={field.multiline}
                  isLink={field.isLink}
                />
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={onClose}>Đóng</Button>
            </div>
          </>
        ) : (
          <FallbackState order={order} orderCode={orderCode} onContactSupport={onContactSupport} />
        )}
      </div>
    </Modal>
  )
}
