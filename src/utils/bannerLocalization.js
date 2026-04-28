const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

export const getLocalizedBannerField = (banner, field, language, fallback = '') => {
  if (!banner) return fallback

  const baseValue = banner[field]
  const translatedValue = isEnglishLanguage(language) ? banner.translations?.en?.[field] : null

  if (hasText(translatedValue)) return translatedValue
  if (hasText(baseValue)) return baseValue

  return baseValue ?? fallback
}

export const getLocalizedBannerTitle = (banner, language, fallback = '') =>
  getLocalizedBannerField(banner, 'title', language, fallback)

export const getLocalizedBannerLink = (banner, language, fallback = '') =>
  getLocalizedBannerField(banner, 'link', language, fallback)

export const getLocalizedBanner = (banner, language) => {
  if (!banner) return banner

  return {
    ...banner,
    title: getLocalizedBannerTitle(banner, language, banner.title || ''),
    link: getLocalizedBannerLink(banner, language, banner.link || '')
  }
}
