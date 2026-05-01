import dayjs from 'dayjs'

export const EMPTY_FLASH_SALE_FORM = {
  name: '',
  translations: {
    en: {
      name: ''
    }
  },
  startAt: null,
  endAt: null,
  discountPercent: '',
  maxQuantity: '',
  products: []
}

export const getFlashSalesLocale = language => (String(language || '').startsWith('en') ? 'en-US' : 'vi-VN')

const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

export const getLocalizedFlashSaleName = (sale, language, fallback = '') => {
  const translatedName = isEnglishLanguage(language) ? sale?.translations?.en?.name : null

  if (hasText(translatedName)) return translatedName
  if (hasText(sale?.name)) return sale.name

  return fallback
}

export const hasLocalizedFlashSaleName = (sale, language) => {
  if (!isEnglishLanguage(language)) return true
  return hasText(sale?.translations?.en?.name)
}

export const getLocalizedProductTitle = (product, language, fallback = '') => {
  const translatedTitle = isEnglishLanguage(language) ? product?.translations?.en?.title : null

  if (hasText(translatedTitle)) return translatedTitle
  if (hasText(product?.title)) return product.title

  return fallback
}

const formatNumber = (value, locale = 'vi-VN') =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(Number(value) || 0)

export function formatCurrency(amount, locale = 'vi-VN') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VND'
  }).format(Number(amount) || 0)
}

export function formatFlashSaleDateTime(date, locale = 'vi-VN') {
  if (!date) return '--'

  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(date))
  } catch {
    return dayjs(date).format('YYYY-MM-DD HH:mm')
  }
}

export function formatFlashSaleDateRange(sale, locale = 'vi-VN') {
  const formatter = value => {
    if (!value) return '--'

    try {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date(value))
    } catch {
      return dayjs(value).format('DD/MM/YYYY')
    }
  }

  return `${formatter(sale?.startAt)} - ${formatter(sale?.endAt)}`
}

export function formatFlashSaleDiscount(discountPercent, locale = 'vi-VN') {
  return `-${formatNumber(discountPercent, locale)}%`
}

export function formatFlashSaleQuantity(sale, locale = 'vi-VN') {
  return `${formatNumber(sale?.soldQuantity, locale)}/${formatNumber(sale?.maxQuantity, locale)}`
}

export function getFlashSaleStatusMeta(status, t) {
  const activeClassName =
    'border border-[var(--admin-success-border)] bg-[var(--admin-success-bg-soft)] text-[var(--admin-success-text)]'
  const scheduledClassName =
    'border border-[var(--admin-info-border)] bg-[var(--admin-info-bg-soft)] text-[var(--admin-info-text)]'
  const completedClassName =
    'border border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)]'

  switch (status) {
    case 'active':
      return { className: activeClassName, label: t?.('status.active') || 'Active' }
    case 'scheduled':
      return { className: scheduledClassName, label: t?.('status.scheduled') || 'Scheduled' }
    case 'completed':
      return { className: completedClassName, label: t?.('status.completed') || 'Completed' }
    case 'inactive':
      return { className: completedClassName, label: t?.('status.inactive') || 'Inactive' }
    default:
      return { className: completedClassName, label: t?.('status.unknown') || 'Unknown' }
  }
}

export function getFlashSaleProgressPercent(sale) {
  if (!sale?.maxQuantity) return 0
  return Math.min((Number(sale.soldQuantity) / Number(sale.maxQuantity)) * 100, 100)
}

export function getFlashSaleStats(flashSales) {
  const sales = Array.isArray(flashSales) ? flashSales : []

  return {
    totalRevenue: sales.reduce((sum, sale) => sum + (Number(sale.revenue) || 0), 0),
    activeSales: sales.filter(sale => sale.status === 'active').length,
    totalProductsSold: sales.reduce((sum, sale) => sum + (Number(sale.soldQuantity) || 0), 0),
    totalPrograms: sales.length
  }
}

export function mapFlashSaleToFormData(item) {
  return {
    name: item?.name || '',
    translations: {
      en: {
        name: item?.translations?.en?.name || ''
      }
    },
    startAt: item?.startAt ? dayjs(item.startAt) : null,
    endAt: item?.endAt ? dayjs(item.endAt) : null,
    discountPercent: item?.discountPercent ?? '',
    maxQuantity: item?.maxQuantity ?? '',
    products: (item?.products || []).map(product => (typeof product === 'object' ? product._id : product))
  }
}

export function serializeFlashSaleForm(formData) {
  return {
    name: formData.name,
    translations: {
      en: {
        name: formData.translations?.en?.name?.trim() || ''
      }
    },
    startAt: formData.startAt.toISOString(),
    endAt: formData.endAt.toISOString(),
    discountPercent: parseInt(formData.discountPercent, 10),
    maxQuantity: parseInt(formData.maxQuantity, 10),
    products: formData.products
  }
}

export function validateFlashSaleForm(formData, t) {
  if (!formData.name?.trim()) return t?.('form.validation.name') || 'Please enter the program name!'
  if (!formData.startAt) return t?.('form.validation.startAt') || 'Please select a start date!'
  if (!formData.endAt) return t?.('form.validation.endAt') || 'Please select an end date!'
  if (!formData.discountPercent) return t?.('form.validation.discountPercent') || 'Please enter the discount percent!'
  if (!formData.maxQuantity) return t?.('form.validation.maxQuantity') || 'Please enter the maximum quantity!'
  if (!Array.isArray(formData.products) || formData.products.length === 0) {
    return t?.('form.validation.products') || 'Please select at least one product!'
  }
  if (dayjs(formData.endAt).isBefore(dayjs(formData.startAt))) {
    return t?.('form.validation.dateOrder') || 'End time must be after start time!'
  }
  return null
}

export function mergeProductOptions(products, selectedIds, existingProducts = [], loadingTitle = 'Loading...') {
  const mergedProducts = [...(products || [])]
  const existingMap = new Map((existingProducts || []).map(product => [product._id, product]))

  ;(selectedIds || []).forEach(id => {
    if (!mergedProducts.find(product => product._id === id)) {
      mergedProducts.push(existingMap.get(id) || { _id: id, title: loadingTitle })
    }
  })

  return mergedProducts
}
