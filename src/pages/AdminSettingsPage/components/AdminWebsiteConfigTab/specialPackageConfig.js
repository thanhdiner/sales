import enComingSoon from '@/i18n/locales/en/client/comingSoon.json'
import viComingSoon from '@/i18n/locales/vi/client/comingSoon.json'

const getPath = (source, path) =>
  String(path || '')
    .split('.')
    .reduce((result, key) => (result == null ? result : result[key]), source)

const buildSpecialPackageConfig = source => {
  const specialPackage = source?.specialPackage || {}
  const description = specialPackage.description || ''

  return {
    seo: {
      title: getPath(specialPackage, 'seo.title') || '',
      description
    },
    noIndex: true,
    eyebrow: specialPackage.eyebrow || '',
    title: specialPackage.title || '',
    description,
    note: specialPackage.note || ''
  }
}

export const defaultSpecialPackageConfig = {
  ...buildSpecialPackageConfig(viComingSoon),
  translations: {
    en: buildSpecialPackageConfig(enComingSoon)
  }
}

const isPlainObject = value => value && typeof value === 'object' && !Array.isArray(value)

const mergeSpecialPackageValue = (fallback, value) => {
  if (isPlainObject(fallback)) {
    const nextValue = isPlainObject(value) ? value : {}
    return Array.from(new Set([...Object.keys(fallback), ...Object.keys(nextValue)])).reduce((result, key) => {
      result[key] = mergeSpecialPackageValue(fallback[key], nextValue[key])
      return result
    }, {})
  }

  return value !== undefined && value !== null ? value : fallback
}

export const getSpecialPackageInitialValues = value => mergeSpecialPackageValue(defaultSpecialPackageConfig, value)
