import dayjs from 'dayjs'

export const DEFAULT_PROMO_CODE_PAGINATION = {
  current: 1,
  pageSize: 10,
  total: 0
}

export const PROMO_CODE_FORM_INITIAL_VALUES = {
  discountType: 'percent',
  minOrder: 0,
  isActive: true
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(Number(amount) || 0)
}

export function getPromoCodeStatusMeta(record) {
  if (!record?.isActive) return { color: 'red', label: 'Đã tắt' }
  if (record?.expiresAt && dayjs(record.expiresAt).isBefore(dayjs())) {
    return { color: 'orange', label: 'Hết hạn' }
  }
  if (record?.usageLimit && record.usedCount >= record.usageLimit) {
    return { color: 'orange', label: 'Hết lượt' }
  }

  return { color: 'green', label: 'Hoạt động' }
}

export function getPromoCodeStats(promoCodes) {
  const items = Array.isArray(promoCodes) ? promoCodes : []

  return {
    total: items.length,
    active: items.filter(code => code.isActive).length,
    expired: items.filter(code => code.expiresAt && dayjs(code.expiresAt).isBefore(dayjs())).length,
    totalUsed: items.reduce((sum, code) => sum + (Number(code.usedCount) || 0), 0)
  }
}

export function getPromoCodeUsagePercentage(record) {
  if (!record?.usageLimit) return 0
  return Math.min((record.usedCount / record.usageLimit) * 100, 100)
}

export function getPromoCodeFormValues(record) {
  return {
    ...record,
    expiresAt: record?.expiresAt ? dayjs(record.expiresAt) : null
  }
}

export function normalizePromoCodeFormValues(values) {
  return {
    ...values,
    expiresAt: values?.expiresAt ? values.expiresAt.toDate() : null
  }
}
