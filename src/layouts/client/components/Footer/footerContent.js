import clientFooterVi from '@/i18n/locales/vi/client/footer.json'
import clientFooterEn from '@/i18n/locales/en/client/footer.json'

const isObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const clone = value => JSON.parse(JSON.stringify(value || {}))
const asArray = value => (Array.isArray(value) ? value : [])

const DEFAULT_PHONE = '0823387108'
const DEFAULT_EMAIL = 'smartmall.business.official@gmail.com'
const DEFAULT_FACEBOOK_PAGE = 'lunashop.business.official'

const paymentMethods = [
  { label: 'Visa', icon: '/icons/paymentVisa.svg', enabled: true },
  { label: 'Mastercard', icon: '/icons/paymentMastercard.svg', enabled: true },
  { label: 'JCB', icon: '/icons/paymentJCB.svg', enabled: true },
  { label: 'Momo', icon: '/icons/paymentMomo.svg', enabled: true },
  { label: 'ZaloPay', icon: '/icons/paymentZalopay.svg', enabled: true },
  { label: 'ViettelMoney', icon: '/icons/paymentViettelMoney.svg', enabled: true },
  { label: 'Vnpay', icon: '/icons/paymentVnpay.svg', enabled: true },
  { label: 'Pay-In-Cash', icon: '/icons/paymentPayInCash.svg', enabled: true }
]

const getContactInfo = websiteConfig => websiteConfig?.contactInfo || {}

const getPhone = websiteConfig => getContactInfo(websiteConfig).phone || DEFAULT_PHONE

const getEmail = websiteConfig => getContactInfo(websiteConfig).email || DEFAULT_EMAIL

const getFacebookUrl = websiteConfig => {
  const socialFacebook = getContactInfo(websiteConfig).socialMedia?.facebook
  const facebook = socialFacebook || getContactInfo(websiteConfig).facebook || DEFAULT_FACEBOOK_PAGE

  if (/^https?:\/\//i.test(facebook)) return facebook
  return `https://www.facebook.com/${facebook}`
}

const getZaloUrl = websiteConfig => `https://zalo.me/${getPhone(websiteConfig).replace(/\D/g, '') || DEFAULT_PHONE}`

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

const normalizeLinks = links =>
  asArray(links)
    .map(link => ({
      label: link?.label || '',
      url: link?.url || '',
      external: Boolean(link?.external)
    }))
    .filter(link => link.label && link.url)

const normalizePaymentMethods = (methods, { includeDisabled = false } = {}) =>
  asArray(methods)
    .map(method => ({
      label: method?.label || '',
      icon: method?.icon || '',
      enabled: method?.enabled !== false
    }))
    .filter(method => method.label && method.icon && (includeDisabled || method.enabled))

const normalizeSocialLinks = links =>
  asArray(links)
    .map(link => ({
      label: link?.label || '',
      url: link?.url || '',
      icon: link?.icon || '',
      external: link?.external !== false
    }))
    .filter(link => link.label && link.url && link.icon)

export const buildFooterContent = (source, websiteConfig = null) => ({
  easterEgg: source.easterEgg || '',
  customerSupport: {
    title: source.customerSupport?.title || '',
    hotlineLabel: source.customerSupport?.hotline || '',
    phone: getPhone(websiteConfig),
    workingTime: source.customerSupport?.workingTime || '',
    links: [
      { label: source.customerSupport?.shoppingGuide || '', url: '/shopping-guide', external: false },
      { label: source.customerSupport?.privacyPolicy || '', url: '/privacy-policy', external: false },
      { label: source.customerSupport?.returnPolicy || '', url: '/return-policy', external: false },
      { label: source.customerSupport?.faq || '', url: '/faq', external: false }
    ],
    supportEmailLabel: source.customerSupport?.supportEmail || '',
    email: getEmail(websiteConfig)
  },
  about: {
    title: source.about?.title || '',
    links: [
      { label: source.about?.aboutUs || '', url: '/about', external: false },
      { label: source.about?.terms || '', url: '/terms-of-service', external: false },
      { label: source.about?.cooperation || '', url: '/cooperation-contact', external: false }
    ]
  },
  services: {
    title: source.services?.title || '',
    links: [
      { label: source.services?.gameAccount || '', url: '/game-account', external: false },
      { label: source.services?.licenseUpgrade || '', url: '/license', external: false },
      { label: source.services?.coupons || '', url: '/coupons', external: false },
      { label: source.services?.specialPackage || '', url: '/special-package', external: false }
    ]
  },
  payment: {
    title: source.payment?.title || '',
    methods: clone(paymentMethods)
  },
  social: {
    title: source.social?.title || '',
    links: [
      { label: 'Facebook', url: getFacebookUrl(websiteConfig), icon: '/icons/iconFb.svg', external: true },
      { label: 'Youtube', url: '#!', icon: '/icons/iconYoutube.svg', external: false },
      { label: 'Zalo', url: getZaloUrl(websiteConfig), icon: '/icons/iconZalo.svg', external: true }
    ]
  }
})

export const DEFAULT_FOOTER_CONTENT = buildFooterContent(clientFooterVi)
export const DEFAULT_FOOTER_TRANSLATIONS = {
  en: buildFooterContent(clientFooterEn)
}

export const normalizeFooterContent = (content, { language = 'vi', websiteConfig = null, includeDisabled = false } = {}) => {
  const fallback = String(language || '').toLowerCase().startsWith('en')
    ? buildFooterContent(clientFooterEn, websiteConfig)
    : buildFooterContent(clientFooterVi, websiteConfig)
  const merged = mergeFallback(fallback, content)

  return {
    ...merged,
    customerSupport: {
      ...merged.customerSupport,
      links: normalizeLinks(merged.customerSupport?.links)
    },
    about: {
      ...merged.about,
      links: normalizeLinks(merged.about?.links)
    },
    services: {
      ...merged.services,
      links: normalizeLinks(merged.services?.links)
    },
    payment: {
      ...merged.payment,
      methods: normalizePaymentMethods(merged.payment?.methods, { includeDisabled })
    },
    social: {
      ...merged.social,
      links: normalizeSocialLinks(merged.social?.links)
    }
  }
}

const alignLinks = (baseLinks = [], translatedLinks = []) =>
  asArray(baseLinks).map((link, index) => ({
    label: translatedLinks?.[index]?.label || '',
    url: link?.url || translatedLinks?.[index]?.url || '',
    external: Boolean(link?.external ?? translatedLinks?.[index]?.external)
  }))

const alignPaymentMethods = (baseMethods = [], translatedMethods = []) =>
  asArray(baseMethods).map((method, index) => ({
    label: translatedMethods?.[index]?.label || method?.label || '',
    icon: method?.icon || translatedMethods?.[index]?.icon || '',
    enabled: method?.enabled !== false
  }))

const alignSocialLinks = (baseLinks = [], translatedLinks = []) =>
  asArray(baseLinks).map((link, index) => ({
    label: translatedLinks?.[index]?.label || link?.label || '',
    url: link?.url || translatedLinks?.[index]?.url || '',
    icon: link?.icon || translatedLinks?.[index]?.icon || '',
    external: link?.external !== false
  }))

export const alignFooterTranslation = (content = {}, translation = {}) => {
  const next = mergeFallback(DEFAULT_FOOTER_TRANSLATIONS.en, translation)

  next.customerSupport = {
    ...(next.customerSupport || {}),
    phone: content.customerSupport?.phone || next.customerSupport?.phone || '',
    email: content.customerSupport?.email || next.customerSupport?.email || '',
    links: alignLinks(content.customerSupport?.links, next.customerSupport?.links)
  }
  next.about = {
    ...(next.about || {}),
    links: alignLinks(content.about?.links, next.about?.links)
  }
  next.services = {
    ...(next.services || {}),
    links: alignLinks(content.services?.links, next.services?.links)
  }
  next.payment = {
    ...(next.payment || {}),
    methods: alignPaymentMethods(content.payment?.methods, next.payment?.methods)
  }
  next.social = {
    ...(next.social || {}),
    links: alignSocialLinks(content.social?.links, next.social?.links)
  }

  return next
}
