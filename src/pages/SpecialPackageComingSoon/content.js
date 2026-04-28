const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

const firstText = (...values) => values.find(hasText) || ''

const getPath = (source, path) =>
  String(path || '')
    .split('.')
    .reduce((result, key) => (result == null ? result : result[key]), source)

const getLocalizedRoot = (config, language) => (isEnglishLanguage(language) ? config?.translations?.en || {} : {})

const getLocalizedText = (config, localizedRoot, path, fallback) =>
  firstText(getPath(localizedRoot, path), getPath(config, path), fallback)

export const getSpecialPackageContent = ({ websiteConfig, language, t }) => {
  const config = websiteConfig?.specialPackage || {}
  const localizedRoot = getLocalizedRoot(config, language)

  const description = getLocalizedText(config, localizedRoot, 'description', t('specialPackage.description'))

  return {
    seo: {
      title: getLocalizedText(config, localizedRoot, 'seo.title', t('specialPackage.seo.title')),
      description: getLocalizedText(config, localizedRoot, 'seo.description', description)
    },
    noIndex: typeof config.noIndex === 'boolean' ? config.noIndex : true,
    eyebrow: getLocalizedText(config, localizedRoot, 'eyebrow', t('specialPackage.eyebrow')),
    title: getLocalizedText(config, localizedRoot, 'title', t('specialPackage.title')),
    description,
    note: getLocalizedText(config, localizedRoot, 'note', t('specialPackage.note'))
  }
}
