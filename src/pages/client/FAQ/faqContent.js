import clientFaqVi from '@/i18n/locales/vi/client/faq.json'
import clientFaqEn from '@/i18n/locales/en/client/faq.json'

const isObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const clone = value => JSON.parse(JSON.stringify(value || {}))
const asArray = value => (Array.isArray(value) ? value : [])

const mergeFallback = (fallbackValue, value) => {
  if (Array.isArray(fallbackValue)) {
    if (!Array.isArray(value) || value.length === 0) return clone(fallbackValue)

    return value.map((item, index) => mergeFallback(fallbackValue[index] ?? {}, item))
  }

  if (isObject(fallbackValue)) {
    const source = isObject(value) ? value : {}
    const merged = {}

    Object.keys(fallbackValue).forEach(key => {
      merged[key] = mergeFallback(fallbackValue[key], source[key])
    })

    Object.keys(source).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(merged, key)) {
        merged[key] = source[key]
      }
    })

    return merged
  }

  return value === undefined || value === null || value === '' ? fallbackValue : value
}

const interpolate = (value, variables = {}) => {
  if (Array.isArray(value)) {
    return value.map(item => interpolate(item, variables))
  }

  if (isObject(value)) {
    return Object.keys(value).reduce((result, key) => {
      result[key] = interpolate(value[key], variables)
      return result
    }, {})
  }

  if (typeof value !== 'string') return value

  return Object.keys(variables).reduce(
    (text, key) => text.replaceAll(`{{${key}}}`, variables[key] || ''),
    value
  )
}

const buildFaqContent = source => ({
  seo: source.seo || {},
  page: source.page || {},
  items: asArray(source.items).map(item => ({
    id: item.id || '',
    question: item.question || '',
    answer: item.answer || ''
  })),
  support: source.support || {}
})

export const DEFAULT_FAQ_CONTENT = buildFaqContent(clientFaqVi)
export const DEFAULT_FAQ_TRANSLATIONS = {
  en: buildFaqContent(clientFaqEn)
}

export const normalizeFaqContent = (content, { language = 'vi', phone = '' } = {}) => {
  const fallback = String(language || '').toLowerCase().startsWith('en')
    ? DEFAULT_FAQ_TRANSLATIONS.en
    : DEFAULT_FAQ_CONTENT

  return interpolate(mergeFallback(fallback, content), { phone })
}

export const alignFaqTranslation = (content = {}, translation = {}) => {
  const next = mergeFallback(DEFAULT_FAQ_TRANSLATIONS.en, translation)

  next.items = asArray(content.items).map((item, index) => ({
    id: item.id,
    question: next.items?.[index]?.question || '',
    answer: next.items?.[index]?.answer || ''
  }))

  return next
}
