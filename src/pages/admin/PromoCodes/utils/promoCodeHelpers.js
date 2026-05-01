import dayjs from 'dayjs'

const DISCOUNT_TYPE_PERCENT = 'percent'
const DISCOUNT_TYPE_FIXED = 'fixed'
const DISCOUNT_TYPE_AMOUNT = 'amount'
const DISCOUNT_TYPE_FREE_SHIPPING = 'free_shipping'

export const PROMO_CODE_STATUS_FILTERS = ['all', 'active', 'expired', 'disabled']
export const PROMO_CODE_DISCOUNT_TYPE_FILTERS = ['all', 'percent', 'fixed', 'free_shipping']
export const PROMO_CODE_AUDIENCE_FILTERS = ['all', 'all_customers', 'new_customers', 'specific_customers', 'customer_groups']
export const PROMO_CODE_DATE_FIELDS = ['expiresAt', 'createdAt']

export const DEFAULT_PROMO_CODE_PAGINATION = {
  current: 1,
  pageSize: 10,
  total: 0
}

export const DEFAULT_PROMO_CODE_FILTERS = {
  search: '',
  status: 'all',
  discountType: 'all',
  audience: 'all',
  dateField: 'expiresAt',
  dateRange: null
}

export const PROMO_CODE_FORM_INITIAL_VALUES = {
  discountType: DISCOUNT_TYPE_PERCENT,
  category: 'all',
  title: '',
  description: '',
  minOrder: 0,
  usagePerCustomer: 1,
  newCustomersOnly: false,
  audienceType: 'all_customers',
  applicableProducts: [],
  applicableCategories: [],
  excludedProducts: [],
  isActive: true,
  translations: {
    en: {
      title: '',
      description: ''
    }
  }
}

export const getLocale = language => (language?.startsWith('en') ? 'en-US' : 'vi-VN')

export const isPercentDiscount = discountType => normalizeDiscountTypeForForm(discountType) === DISCOUNT_TYPE_PERCENT

export const isFixedAmountDiscount = discountType => normalizeDiscountTypeForForm(discountType) === DISCOUNT_TYPE_FIXED

export const isFreeShippingDiscount = (discountType, record = {}) =>
  normalizeDiscountTypeForForm(discountType) === DISCOUNT_TYPE_FREE_SHIPPING ||
  record?.category === 'shipping'

export const normalizeDiscountTypeForForm = discountType =>
  discountType === 'percentage'
    ? DISCOUNT_TYPE_PERCENT
    : discountType === DISCOUNT_TYPE_AMOUNT
      ? DISCOUNT_TYPE_FIXED
      : discountType || DISCOUNT_TYPE_PERCENT

export const normalizeDiscountTypeForApi = discountType =>
  discountType === DISCOUNT_TYPE_AMOUNT ? DISCOUNT_TYPE_FIXED : discountType

export function getPromoCodeMaxDiscount(record) {
  return record?.maxDiscountAmount ?? record?.maxDiscount ?? null
}

export function getPromoCodeMinimumOrder(record) {
  return record?.minimumOrderAmount ?? record?.minOrder ?? 0
}

export function getPromoCodeUsageLimit(record) {
  return record?.usageLimit ?? null
}

export function getPromoCodeUsedCount(record) {
  return Number(record?.usedCount) || 0
}

export function getPromoCodeCustomerUsedCount(record) {
  const usedBy = Array.isArray(record?.usedBy) ? record.usedBy : []
  return Number(record?.customerUsedCount ?? usedBy.length ?? record?.usedCount) || 0
}

export function getPromoCodeCampaign(record, language = 'vi', t = key => key) {
  const localizedTitle = record?.campaign || record?.title

  if (localizedTitle) return localizedTitle

  return t('table.fallbackCampaignTitle', { code: record?.code || '' })
}

export function formatNumber(value, language = 'vi') {
  return new Intl.NumberFormat(getLocale(language)).format(Number(value) || 0)
}

export function formatPromoCodeNumberInput(value, language = 'vi') {
  if (value === null || value === undefined || value === '') return ''
  return formatNumber(value, language)
}

export function formatPromoCodePercentInput(value) {
  if (value === null || value === undefined || value === '') return ''
  return `${value}%`
}

export function parsePromoCodeNumericInput(value) {
  return value?.replace(/[^\d]/g, '') || ''
}

export function formatCurrency(amount, language = 'vi') {
  return new Intl.NumberFormat(getLocale(language), {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(Number(amount) || 0)
}

export function getPromoCodeDatePickerFormat(language = 'vi') {
  return language?.startsWith('en') ? 'MM/DD/YYYY' : 'DD/MM/YYYY'
}

export function formatPromoCodeDate(value, language = 'vi') {
  if (!value) return ''

  const date = dayjs(value)
  if (!date.isValid()) return ''

  return date.format(getPromoCodeDatePickerFormat(language))
}

export function formatPromoCodeDateTime(value, language = 'vi') {
  const formattedDate = formatPromoCodeDate(value, language)
  if (!formattedDate) return ''

  const date = dayjs(value)
  return `${formattedDate} ${date.format('HH:mm')}`
}

export function getDiscountTypeLabel(discountType, t = key => key) {
  const normalizedType = normalizeDiscountTypeForForm(discountType)

  if (normalizedType === DISCOUNT_TYPE_FREE_SHIPPING) {
    return t('discount.types.freeShipping')
  }

  return normalizedType === DISCOUNT_TYPE_PERCENT
    ? t('discount.types.percent')
    : t('discount.types.fixed')
}

export function getDiscountText(record, language = 'vi', t = key => key) {
  if (isFreeShippingDiscount(record?.discountType, record)) {
    return t('discount.freeShipping')
  }

  if (isPercentDiscount(record?.discountType)) {
    return t('discount.percent', { value: formatNumber(record?.discountValue, language) })
  }

  return t('discount.amount', { value: formatCurrency(record?.discountValue, language) })
}

export function getConditionItems(record, language = 'vi', t = key => key) {
  const conditions = []
  const minOrder = getPromoCodeMinimumOrder(record)
  const maxDiscount = getPromoCodeMaxDiscount(record)

  if (Number(minOrder) > 0) {
    conditions.push(t('table.minOrder', { amount: formatCurrency(minOrder, language) }))
  }

  if (maxDiscount) {
    conditions.push(t('table.maxDiscount', { amount: formatCurrency(maxDiscount, language) }))
  }

  return conditions
}

export function getConditionText(record, language = 'vi', t = key => key) {
  const conditions = getConditionItems(record, language, t)

  return conditions.length ? conditions.join(t('table.conditionSeparator')) : t('table.noConditions')
}

export function getUsageText(record, language = 'vi', t = key => key) {
  const usedCount = formatNumber(getPromoCodeUsedCount(record), language)
  const usageLimit = getPromoCodeUsageLimit(record) ? formatNumber(getPromoCodeUsageLimit(record), language) : t('common.infinity')

  return t('table.usageValue', { used: usedCount, limit: usageLimit })
}

export function getPromoCodeUserLabel(user, t = key => key) {
  if (!user) return t('common.allCustomers')
  if (typeof user === 'string') return user

  return user.fullName || user.username || user.email || user._id || t('common.notAvailable')
}

export function getPromoCodeAudienceText(record, t = key => key) {
  if (record?.audienceType === 'new_customers' || record?.category === 'new') {
    return t('audience.newCustomers')
  }

  if (record?.audienceType === 'specific_customers' || record?.userId) {
    return record?.userId ? getPromoCodeUserLabel(record.userId, t) : t('audience.specificCustomers')
  }

  if (record?.audienceType === 'customer_groups' || ['vip', 'student'].includes(record?.category)) {
    return t('audience.customerGroups')
  }

  return t('audience.allCustomers')
}

export function getPromoCodeUsedByCount(record, language = 'vi') {
  return formatNumber(getPromoCodeCustomerUsedCount(record), language)
}

export function getPromoCodeStatusKey(record) {
  if (record?.status === 'disabled') return 'disabled'
  if (record?.status === 'expired') return 'expired'
  if (record?.status === 'active') return 'active'
  if (record?.isActive === false) return 'disabled'
  if (record?.expiresAt && dayjs(record.expiresAt).isBefore(dayjs())) return 'expired'
  if (getPromoCodeUsageLimit(record) && getPromoCodeUsedCount(record) >= getPromoCodeUsageLimit(record)) {
    return 'usageLimitReached'
  }

  return 'active'
}

export function getPromoCodeStatusMeta(record, t = key => key) {
  const statusKey = getPromoCodeStatusKey(record)

  if (statusKey === 'disabled') return { color: 'red', label: t('status.disabled'), key: statusKey }
  if (statusKey === 'expired') return { color: 'orange', label: t('status.expired'), key: statusKey }
  if (statusKey === 'usageLimitReached') {
    return { color: 'orange', label: t('status.usageLimitReached'), key: statusKey }
  }

  return { color: 'green', label: t('status.active'), key: statusKey }
}

export function getPromoCodeStats(promoCodes) {
  const items = Array.isArray(promoCodes) ? promoCodes : []

  return {
    total: items.length,
    active: items.filter(code => getPromoCodeStatusKey(code) === 'active').length,
    expired: items.filter(code => getPromoCodeStatusKey(code) === 'expired').length,
    totalUsed: items.reduce((sum, code) => sum + getPromoCodeUsedCount(code), 0)
  }
}

export function getPromoCodeUsagePercentage(record) {
  const usageLimit = getPromoCodeUsageLimit(record)
  if (!usageLimit) return 0
  return Math.min((getPromoCodeUsedCount(record) / usageLimit) * 100, 100)
}

export function getPromoCodeFormValues(record) {
  const normalizedDiscountType = isFreeShippingDiscount(record?.discountType, record)
    ? DISCOUNT_TYPE_FREE_SHIPPING
    : normalizeDiscountTypeForForm(record?.discountType)

  return {
    ...record,
    category: record?.category || PROMO_CODE_FORM_INITIAL_VALUES.category,
    title: record?.title || record?.campaign || '',
    maxDiscount: getPromoCodeMaxDiscount(record),
    minOrder: getPromoCodeMinimumOrder(record),
    discountType: normalizedDiscountType,
    audienceType: record?.audienceType || (record?.userId ? 'specific_customers' : record?.category === 'new' ? 'new_customers' : 'all_customers'),
    usagePerCustomer: record?.usagePerCustomer || 1,
    newCustomersOnly: Boolean(record?.newCustomersOnly || record?.category === 'new'),
    startsAt: record?.startsAt ? dayjs(record.startsAt) : null,
    expiresAt: record?.expiresAt ? dayjs(record.expiresAt) : null,
    translations: {
      en: {
        title: record?.translations?.en?.title || '',
        description: record?.translations?.en?.description || ''
      }
    }
  }
}

function normalizePromoCodeTranslations(translations = {}) {
  return {
    en: {
      title: typeof translations?.en?.title === 'string' ? translations.en.title.trim() : '',
      description: typeof translations?.en?.description === 'string' ? translations.en.description : ''
    }
  }
}

function normalizePromoCodeStringArray(value) {
  return Array.isArray(value)
    ? value.map(item => String(item || '').trim()).filter(Boolean)
    : []
}

export function normalizePromoCodeFormValues(values) {
  const isFreeShipping = values?.discountType === DISCOUNT_TYPE_FREE_SHIPPING
  const isNewCustomerCode = values?.newCustomersOnly || values?.audienceType === 'new_customers'
  const normalizedCategory = isFreeShipping
    ? 'shipping'
    : isNewCustomerCode
      ? 'new'
      : values?.category || PROMO_CODE_FORM_INITIAL_VALUES.category

  return {
    code: typeof values?.code === 'string' ? values.code.trim().toUpperCase() : values?.code,
    title: typeof values?.title === 'string' ? values.title.trim() : '',
    description: typeof values?.description === 'string' ? values.description : '',
    category: normalizedCategory,
    translations: normalizePromoCodeTranslations(values?.translations),
    discountType: isFreeShipping ? DISCOUNT_TYPE_FIXED : normalizeDiscountTypeForApi(values?.discountType),
    discountValue: isFreeShipping ? 0 : values?.discountValue,
    maxDiscount: isFreeShipping ? null : values?.maxDiscount ?? null,
    minOrder: values?.minOrder ?? 0,
    applicableProducts: normalizePromoCodeStringArray(values?.applicableProducts),
    applicableCategories: normalizePromoCodeStringArray(values?.applicableCategories),
    excludedProducts: normalizePromoCodeStringArray(values?.excludedProducts),
    usageLimit: values?.usageLimit ?? null,
    usagePerCustomer: values?.usagePerCustomer ?? 1,
    newCustomersOnly: Boolean(values?.newCustomersOnly),
    audienceType: isNewCustomerCode ? 'new_customers' : values?.audienceType || PROMO_CODE_FORM_INITIAL_VALUES.audienceType,
    specificCustomers: normalizePromoCodeStringArray(values?.specificCustomers),
    customerGroups: normalizePromoCodeStringArray(values?.customerGroups),
    startsAt: values?.startsAt ? values.startsAt.toDate() : null,
    expiresAt: values?.expiresAt ? values.expiresAt.toDate() : null,
    isActive: Boolean(values?.isActive)
  }
}

export function getPromoCodeApiFilters(filters = {}) {
  const dateRange = Array.isArray(filters.dateRange) ? filters.dateRange : []
  const [startDate, endDate] = dateRange

  return {
    search: filters.search,
    status: filters.status !== 'all' ? filters.status : undefined,
    discountType: filters.discountType !== 'all' ? filters.discountType : undefined,
    audience: filters.audience !== 'all' ? filters.audience : undefined,
    dateField: filters.dateField,
    startDate: startDate ? startDate.startOf('day').toISOString() : undefined,
    endDate: endDate ? endDate.endOf('day').toISOString() : undefined
  }
}

export function getPromoCodePaginationSummary({ pagination = DEFAULT_PROMO_CODE_PAGINATION, t = key => key, language = 'vi' } = {}) {
  const total = Number(pagination?.total) || 0
  const current = Number(pagination?.current) || 1
  const pageSize = Number(pagination?.pageSize) || DEFAULT_PROMO_CODE_PAGINATION.pageSize
  const rangeStart = total === 0 ? 0 : (current - 1) * pageSize + 1
  const rangeEnd = total === 0 ? 0 : Math.min(current * pageSize, total)

  return t('table.paginationSummary', {
    rangeStart: formatNumber(rangeStart, language),
    rangeEnd: formatNumber(rangeEnd, language),
    total: formatNumber(total, language)
  })
}

export function getPromoCodeExportRows(promoCodes, language = 'vi', t = key => key) {
  return (Array.isArray(promoCodes) ? promoCodes : []).map(record => ({
    [t('table.columns.code')]: record.code,
    [t('table.columns.campaign')]: getPromoCodeCampaign(record, language, t),
    [t('table.columns.discountType')]: `${getDiscountText(record, language, t)} - ${getDiscountTypeLabel(record.discountType, t)}`,
    [t('table.columns.conditions')]: getConditionText(record, language, t),
    [t('table.columns.usage')]: getUsageText(record, language, t),
    [t('table.columns.audience')]: getPromoCodeAudienceText(record, t),
    [t('table.columns.expiresAt')]: record.expiresAt ? formatPromoCodeDateTime(record.expiresAt, language) : t('common.noLimit'),
    [t('table.columns.createdAt')]: record.createdAt ? formatPromoCodeDateTime(record.createdAt, language) : t('common.noLimit'),
    [t('table.columns.status')]: getPromoCodeStatusMeta(record, t).label
  }))
}

const PROMO_CODE_SERVER_ERROR_KEYS = [
  {
    key: 'duplicate',
    patterns: ['Ma giam gia da ton tai', 'E11000', 'duplicate key']
  },
  {
    key: 'notFound',
    patterns: ['Khong tim thay ma']
  },
  {
    key: 'invalidId',
    patterns: ['ID promo code khong hop le']
  },
  {
    key: 'createFailed',
    patterns: ['Khong the tao ma giam gia']
  },
  {
    key: 'updateFailed',
    patterns: ['Khong the cap nhat ma giam gia']
  },
  {
    key: 'deleteFailed',
    patterns: ['Loi xoa ma']
  },
  {
    key: 'listFailed',
    patterns: ['Loi lay danh sach ma giam gia']
  },
  {
    key: 'detailFailed',
    patterns: ['Loi lay chi tiet']
  },
  {
    key: 'codeAlphanum',
    patterns: ['Mã giảm giá chỉ gồm chữ và số']
  },
  {
    key: 'codeMin',
    patterns: ['Mã giảm giá phải có ít nhất 2 ký tự']
  },
  {
    key: 'codeRequired',
    patterns: ['Mã giảm giá là bắt buộc']
  },
  {
    key: 'discountTypeInvalid',
    patterns: ['discountType phải là percent hoặc fixed']
  },
  {
    key: 'discountTypeRequired',
    patterns: ['discountType là bắt buộc']
  },
  {
    key: 'discountValueRequired',
    patterns: ['discountValue là bắt buộc']
  }
]

export function getPromoCodeServerErrorMessage(error, t = key => key, fallbackKey = 'messages.genericError') {
  const serverMessage = String(
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.response?.error ||
    error?.response?.message ||
    error?.message ||
    ''
  )

  const normalizedMessage = serverMessage.replace(/^API Error \d+:\s*/i, '')
  const matchedError = PROMO_CODE_SERVER_ERROR_KEYS.find(item =>
    item.patterns.some(pattern => normalizedMessage.includes(pattern))
  )

  if (matchedError) {
    return t(`serverErrors.${matchedError.key}`)
  }

  return t(fallbackKey)
}
