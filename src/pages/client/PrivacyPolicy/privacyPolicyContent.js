import clientPrivacyVi from '@/i18n/locales/vi/client/privacy.json'
import clientPrivacyEn from '@/i18n/locales/en/client/privacy.json'

const isObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const clone = value => JSON.parse(JSON.stringify(value || {}))
const asArray = value => (Array.isArray(value) ? value : [])

const mergeFallback = (fallbackValue, value) => {
  if (Array.isArray(fallbackValue)) {
    return Array.isArray(value) && value.length > 0 ? value : clone(fallbackValue)
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

const alignPrimitiveList = (baseList, translationList) => {
  const translations = asArray(translationList)
  return asArray(baseList).map((_item, index) => translations[index] || '')
}

const buildPrivacyPolicyContent = source => ({
  seo: source.seo || {},
  summary: source.summary || {},
  pageHeader: source.pageHeader || {},
  sidebar: source.sidebar || {},
  sections: [
    { id: 'thu-thap-thong-tin', title: source.sections?.dataCollection || '' },
    { id: 'su-dung-thong-tin', title: source.sections?.usage || '' },
    { id: 'chia-se-thong-tin', title: source.sections?.sharing || '' },
    { id: 'bao-mat-thong-tin', title: source.sections?.security || '' },
    { id: 'quyen-nguoi-dung', title: source.sections?.userRights || '' },
    { id: 'cookies', title: source.sections?.cookies || '' },
    { id: 'lien-he', title: source.sections?.contact || '' }
  ],
  dataCollectionSection: {
    ...(source.dataCollectionSection || {}),
    dataTypes: [
      {
        title: source.dataTypes?.personal?.title || '',
        items: asArray(source.dataTypes?.personal?.items)
      },
      {
        title: source.dataTypes?.payment?.title || '',
        items: asArray(source.dataTypes?.payment?.items)
      },
      {
        title: source.dataTypes?.technical?.title || '',
        items: asArray(source.dataTypes?.technical?.items)
      },
      {
        title: source.dataTypes?.behavior?.title || '',
        items: asArray(source.dataTypes?.behavior?.items)
      }
    ]
  },
  informationUsageSection: {
    ...(source.informationUsageSection || {}),
    items: [
      source.usageTimeline?.service,
      source.usageTimeline?.experience,
      source.usageTimeline?.marketing,
      source.usageTimeline?.securityCompliance
    ].filter(Boolean)
  },
  informationSharingSection: {
    ...(source.informationSharingSection || {}),
    allowed: asArray(source.sharingData?.allowed),
    disallowed: asArray(source.sharingData?.disallowed)
  },
  securitySection: {
    ...(source.securitySection || {}),
    measures: [
      source.securityMeasures?.ssl,
      source.securityMeasures?.firewall,
      source.securityMeasures?.accessControl,
      source.securityMeasures?.backup
    ].filter(Boolean)
  },
  userRightsSection: {
    ...(source.userRightsSection || {}),
    rights: [
      source.userRights?.know,
      source.userRights?.accessEdit,
      source.userRights?.delete,
      source.userRights?.unsubscribe,
      source.userRights?.complain,
      source.userRights?.copy
    ].filter(Boolean)
  },
  cookiesSection: {
    ...(source.cookiesSection || {}),
    categories: [
      { key: 'essential', ...(source.cookieCategories?.essential || {}) },
      { key: 'performance', ...(source.cookieCategories?.performance || {}) },
      { key: 'marketing', ...(source.cookieCategories?.marketing || {}) }
    ]
  },
  faqSection: {
    ...(source.faqSection || {}),
    items: [
      source.faq?.whyCollect,
      source.faq?.thirdParty,
      source.faq?.deleteAccount,
      source.faq?.cookiesControl
    ].filter(Boolean)
  },
  contactSection: source.contactSection || {},
  contactModal: {
    ...(source.contactModal || {}),
    email: 'lunashop.business.official@gmail.com',
    phone: '0822387108'
  }
})

export const DEFAULT_PRIVACY_POLICY_CONTENT = buildPrivacyPolicyContent(clientPrivacyVi)
export const DEFAULT_PRIVACY_POLICY_TRANSLATIONS = {
  en: buildPrivacyPolicyContent(clientPrivacyEn)
}

export const normalizePrivacyPolicyContent = (content, language = 'vi') => {
  const fallback = String(language || '').toLowerCase().startsWith('en')
    ? DEFAULT_PRIVACY_POLICY_TRANSLATIONS.en
    : DEFAULT_PRIVACY_POLICY_CONTENT

  return mergeFallback(fallback, content)
}

export const alignPrivacyPolicyTranslation = (content = {}, translation = {}) => {
  const next = mergeFallback(DEFAULT_PRIVACY_POLICY_TRANSLATIONS.en, translation)

  next.sections = asArray(content.sections).map((section, index) => ({
    id: section.id,
    title: next.sections?.[index]?.title || ''
  }))

  next.dataCollectionSection.dataTypes = asArray(content.dataCollectionSection?.dataTypes).map((_item, index) => ({
    title: next.dataCollectionSection?.dataTypes?.[index]?.title || '',
    items: alignPrimitiveList(
      content.dataCollectionSection?.dataTypes?.[index]?.items,
      next.dataCollectionSection?.dataTypes?.[index]?.items
    )
  }))

  next.informationUsageSection.items = asArray(content.informationUsageSection?.items).map((_item, index) => ({
    title: next.informationUsageSection?.items?.[index]?.title || '',
    description: next.informationUsageSection?.items?.[index]?.description || ''
  }))

  next.securitySection.measures = asArray(content.securitySection?.measures).map((_item, index) => ({
    title: next.securitySection?.measures?.[index]?.title || '',
    description: next.securitySection?.measures?.[index]?.description || ''
  }))

  next.informationSharingSection.allowed = alignPrimitiveList(
    content.informationSharingSection?.allowed,
    next.informationSharingSection?.allowed
  )
  next.informationSharingSection.disallowed = alignPrimitiveList(
    content.informationSharingSection?.disallowed,
    next.informationSharingSection?.disallowed
  )

  next.userRightsSection.rights = alignPrimitiveList(
    content.userRightsSection?.rights,
    next.userRightsSection?.rights
  )

  next.cookiesSection.categories = asArray(content.cookiesSection?.categories).map((category, index) => ({
    key: category.key,
    title: next.cookiesSection?.categories?.[index]?.title || '',
    description: next.cookiesSection?.categories?.[index]?.description || ''
  }))

  next.faqSection.items = asArray(content.faqSection?.items).map((_item, index) => ({
    question: next.faqSection?.items?.[index]?.question || '',
    answer: next.faqSection?.items?.[index]?.answer || ''
  }))

  return next
}
