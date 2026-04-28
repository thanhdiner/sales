const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

export const getLocalizedPromoCodeField = (promoCode, field, language, fallback = '') => {
  if (!promoCode) return fallback

  const baseValue = promoCode[field]
  const translatedValue = isEnglishLanguage(language) ? promoCode.translations?.en?.[field] : null

  if (hasText(translatedValue)) return translatedValue
  if (hasText(baseValue)) return baseValue

  return baseValue ?? fallback
}

export const getLocalizedPromoCodeTitle = (promoCode, language, fallback = '') =>
  getLocalizedPromoCodeField(promoCode, 'title', language, fallback)

export const getLocalizedPromoCodeDescription = (promoCode, language, fallback = '') =>
  getLocalizedPromoCodeField(promoCode, 'description', language, fallback)

export const getLocalizedPromoCode = (promoCode, language) => {
  if (!promoCode) return promoCode

  return {
    ...promoCode,
    title: getLocalizedPromoCodeTitle(promoCode, language, promoCode.title || ''),
    description: getLocalizedPromoCodeDescription(promoCode, language, promoCode.description || '')
  }
}
