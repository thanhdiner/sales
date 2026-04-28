import viShoppingGuide from '@/i18n/locales/vi/client/shoppingGuide.json'
import enShoppingGuide from '@/i18n/locales/en/client/shoppingGuide.json'
import {
  shoppingGuideDetailedSteps,
  shoppingGuideFaqData,
  shoppingGuideHeroImage,
  shoppingGuidePaymentMethods,
  shoppingGuideSmartTips,
  shoppingGuideSteps,
  shoppingGuideTipsImage
} from '@/pages/ShoppingGuide/data'

const getPath = (source, path) =>
  String(path || '')
    .split('.')
    .reduce((result, key) => (result == null ? result : result[key]), source)

const asArray = value => (Array.isArray(value) ? value : [])

const buildShoppingGuideConfig = source => ({
  seo: {
    title: getPath(source, 'seo.title') || '',
    description: getPath(source, 'seo.description') || ''
  },
  hero: {
    eyebrow: getPath(source, 'hero.eyebrow') || '',
    title: getPath(source, 'hero.title') || '',
    description: getPath(source, 'hero.description') || '',
    registerButton: getPath(source, 'hero.registerButton') || '',
    guideButton: getPath(source, 'hero.guideButton') || '',
    imageAlt: getPath(source, 'hero.imageAlt') || '',
    image: shoppingGuideHeroImage
  },
  processSection: {
    eyebrow: getPath(source, 'processSection.eyebrow') || '',
    title: getPath(source, 'processSection.title') || '',
    previous: getPath(source, 'processSection.previous') || '',
    next: getPath(source, 'processSection.next') || '',
    stepAria: getPath(source, 'processSection.stepAria') || ''
  },
  steps: shoppingGuideSteps.map(step => ({
    title: getPath(source, step.titleKey) || '',
    content: getPath(source, step.contentKey) || ''
  })),
  detailedStepsSection: {
    eyebrow: getPath(source, 'detailedStepsSection.eyebrow') || '',
    title: getPath(source, 'detailedStepsSection.title') || ''
  },
  detailedSteps: shoppingGuideDetailedSteps.map(step => ({
    id: getPath(source, step.idKey) || '',
    title: getPath(source, step.titleKey) || '',
    description: getPath(source, step.descriptionKey) || '',
    chips: step.chipsKey ? asArray(getPath(source, step.chipsKey)) : [],
    checks: step.checksKey ? asArray(getPath(source, step.checksKey)) : [],
    note: step.noteKey ? getPath(source, step.noteKey) || '' : '',
    image: step.image || '',
    reverse: Boolean(step.reverse)
  })),
  paymentSection: {
    eyebrow: getPath(source, 'paymentSection.eyebrow') || '',
    title: getPath(source, 'paymentSection.title') || '',
    description: getPath(source, 'paymentSection.description') || '',
    popular: getPath(source, 'paymentSection.popular') || '',
    securityNote: getPath(source, 'paymentSection.securityNote') || ''
  },
  paymentMethods: shoppingGuidePaymentMethods.map(method => ({
    name: getPath(source, method.nameKey) || '',
    desc: getPath(source, method.descKey) || '',
    popular: Boolean(method.popular),
    badges: asArray(method.badges)
  })),
  faqSection: {
    eyebrow: getPath(source, 'faqSection.eyebrow') || '',
    title: getPath(source, 'faqSection.title') || '',
    toggle: getPath(source, 'faqSection.toggle') || ''
  },
  faq: shoppingGuideFaqData.map(item => ({
    question: getPath(source, item.questionKey) || '',
    answer: getPath(source, item.answerKey) || ''
  })),
  tipsSection: {
    eyebrow: getPath(source, 'tipsSection.eyebrow') || '',
    title: getPath(source, 'tipsSection.title') || '',
    description: getPath(source, 'tipsSection.description') || '',
    imageAlt: getPath(source, 'tipsSection.imageAlt') || '',
    image: shoppingGuideTipsImage
  },
  smartTips: shoppingGuideSmartTips.map(tipKey => getPath(source, tipKey) || ''),
  supportSection: {
    eyebrow: getPath(source, 'supportSection.eyebrow') || '',
    title: getPath(source, 'supportSection.title') || '',
    phoneLabel: getPath(source, 'supportSection.phoneLabel') || '',
    emailLabel: getPath(source, 'supportSection.emailLabel') || '',
    timeLabel: getPath(source, 'supportSection.timeLabel') || '',
    workingTime: getPath(source, 'supportSection.workingTime') || '',
    description: getPath(source, 'supportSection.description') || '',
    browseProducts: getPath(source, 'supportSection.browseProducts') || '',
    viewCoupons: getPath(source, 'supportSection.viewCoupons') || ''
  }
})

export const defaultShoppingGuideConfig = {
  ...buildShoppingGuideConfig(viShoppingGuide),
  translations: {
    en: buildShoppingGuideConfig(enShoppingGuide)
  }
}

const isPlainObject = value => value && typeof value === 'object' && !Array.isArray(value)

const mergeGuideValue = (fallback, value) => {
  if (Array.isArray(fallback)) {
    if (!Array.isArray(value)) return fallback
    return value.map((item, index) => mergeGuideValue(fallback[index], item))
  }

  if (isPlainObject(fallback)) {
    const nextValue = isPlainObject(value) ? value : {}
    return Array.from(new Set([...Object.keys(fallback), ...Object.keys(nextValue)])).reduce((result, key) => {
      result[key] = mergeGuideValue(fallback[key], nextValue[key])
      return result
    }, {})
  }

  return value !== undefined && value !== null ? value : fallback
}

export const getShoppingGuideInitialValues = value => mergeGuideValue(defaultShoppingGuideConfig, value)
