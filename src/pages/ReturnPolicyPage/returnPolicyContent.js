import clientReturnPolicyVi from '@/i18n/locales/vi/client/returnPolicy.json'
import clientReturnPolicyEn from '@/i18n/locales/en/client/returnPolicy.json'
import {
  returnPolicyFaqData,
  returnPolicyHeaderTags,
  returnPolicyOnlineSteps,
  returnPolicyPhysicalSteps,
  returnPolicyProductCategories,
  returnPolicyRefundMethods,
  returnPolicyReturnReasons,
  returnPolicySupportContact,
  returnPolicySupportTips
} from './data'

const isObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const clone = value => JSON.parse(JSON.stringify(value || {}))
const asArray = value => (Array.isArray(value) ? value : [])

const getByPath = (source, path, fallback = '') =>
  String(path || '')
    .split('.')
    .reduce((current, key) => (current && current[key] !== undefined ? current[key] : undefined), source) ?? fallback

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

const alignPrimitiveList = (baseList, translationList) => {
  const translations = asArray(translationList)
  return asArray(baseList).map((_item, index) => translations[index] || '')
}

const alignObjectList = (baseList, translationList, emptyValue = {}) => {
  const translations = asArray(translationList)
  return asArray(baseList).map((_item, index) => mergeFallback(emptyValue, translations[index]))
}

const buildReturnPolicyContent = source => ({
  seo: source.seo || {},
  pageHeader: {
    ...(source.pageHeader || {}),
    tags: returnPolicyHeaderTags.map(tag => ({
      color: tag.color,
      label: getByPath(source, tag.labelKey)
    }))
  },
  process: {
    physical: {
      title: source.process?.physical?.title || '',
      noteTitle: source.process?.physical?.noteTitle || '',
      noteDescription: source.process?.physical?.noteDescription || '',
      steps: returnPolicyPhysicalSteps.map(step => ({
        title: getByPath(source, step.titleKey),
        description: getByPath(source, step.descriptionKey)
      }))
    },
    online: {
      title: source.process?.online?.title || '',
      noteTitle: source.process?.online?.noteTitle || '',
      noteDescriptions: asArray(source.process?.online?.noteDescriptions),
      steps: returnPolicyOnlineSteps.map(step => ({
        title: getByPath(source, step.titleKey),
        description: getByPath(source, step.descriptionKey)
      }))
    }
  },
  conditions: source.conditions || {},
  refund: {
    ...(source.refund || {}),
    methods: returnPolicyRefundMethods.map(method => ({
      key: method.key,
      method: getByPath(source, method.methodKey),
      time: getByPath(source, method.timeKey),
      fee: getByPath(source, method.feeKey),
      popular: Boolean(method.popular)
    }))
  },
  categories: {
    ...(source.categories || {}),
    items: returnPolicyProductCategories.map(category => ({
      key: category.key,
      category: getByPath(source, category.categoryKey),
      returnPeriod: getByPath(source, category.returnPeriodKey),
      conditions: asArray(getByPath(source, category.conditionsKey, [])),
      specialNotes: getByPath(source, category.specialNotesKey)
    }))
  },
  reasons: {
    ...(source.reasons || {}),
    items: returnPolicyReturnReasons.map(reason => ({
      value: reason.value,
      color: reason.color,
      label: getByPath(source, reason.labelKey)
    }))
  },
  faqSection: {
    ...(source.faqSection || {}),
    items: returnPolicyFaqData.map(faq => ({
      question: getByPath(source, faq.questionKey),
      answer: getByPath(source, faq.answerKey)
    }))
  },
  support: {
    ...(source.support || {}),
    tips: returnPolicySupportTips.map(tip => getByPath(source, tip)),
    contact: { ...returnPolicySupportContact }
  },
  footerCta: {
    ...(source.footerCta || {}),
    callUrl: `tel:${returnPolicySupportContact.phone}`,
    emailUrl: `mailto:${returnPolicySupportContact.email}`,
    faqUrl: '/faq'
  }
})

export const DEFAULT_RETURN_POLICY_CONTENT = buildReturnPolicyContent(clientReturnPolicyVi)
export const DEFAULT_RETURN_POLICY_TRANSLATIONS = {
  en: buildReturnPolicyContent(clientReturnPolicyEn)
}

export const normalizeReturnPolicyContent = (content, language = 'vi') => {
  const fallback = String(language || '').toLowerCase().startsWith('en')
    ? DEFAULT_RETURN_POLICY_TRANSLATIONS.en
    : DEFAULT_RETURN_POLICY_CONTENT

  return mergeFallback(fallback, content)
}

export const alignReturnPolicyTranslation = (content = {}, translation = {}) => {
  const next = mergeFallback(DEFAULT_RETURN_POLICY_TRANSLATIONS.en, translation)

  next.pageHeader.tags = alignObjectList(content.pageHeader?.tags, next.pageHeader?.tags, { label: '' })
  next.process.physical.steps = alignObjectList(content.process?.physical?.steps, next.process?.physical?.steps, {
    title: '',
    description: ''
  })
  next.process.online.steps = alignObjectList(content.process?.online?.steps, next.process?.online?.steps, {
    title: '',
    description: ''
  })
  next.process.online.noteDescriptions = alignPrimitiveList(
    content.process?.online?.noteDescriptions,
    next.process?.online?.noteDescriptions
  )
  next.conditions.acceptedPhysicalItems = alignPrimitiveList(
    content.conditions?.acceptedPhysicalItems,
    next.conditions?.acceptedPhysicalItems
  )
  next.conditions.acceptedDigitalItems = alignPrimitiveList(
    content.conditions?.acceptedDigitalItems,
    next.conditions?.acceptedDigitalItems
  )
  next.conditions.rejectedPhysicalItems = alignPrimitiveList(
    content.conditions?.rejectedPhysicalItems,
    next.conditions?.rejectedPhysicalItems
  )
  next.conditions.rejectedDigitalItems = alignPrimitiveList(
    content.conditions?.rejectedDigitalItems,
    next.conditions?.rejectedDigitalItems
  )
  next.refund.methods = asArray(content.refund?.methods).map((method, index) => ({
    key: method.key,
    method: next.refund?.methods?.[index]?.method || '',
    time: next.refund?.methods?.[index]?.time || '',
    fee: next.refund?.methods?.[index]?.fee || ''
  }))
  next.categories.items = asArray(content.categories?.items).map((category, index) => ({
    key: category.key,
    category: next.categories?.items?.[index]?.category || '',
    returnPeriod: next.categories?.items?.[index]?.returnPeriod || '',
    conditions: alignPrimitiveList(category.conditions, next.categories?.items?.[index]?.conditions),
    specialNotes: next.categories?.items?.[index]?.specialNotes || ''
  }))
  next.reasons.items = asArray(content.reasons?.items).map((reason, index) => ({
    value: reason.value,
    label: next.reasons?.items?.[index]?.label || ''
  }))
  next.faqSection.items = asArray(content.faqSection?.items).map((_item, index) => ({
    question: next.faqSection?.items?.[index]?.question || '',
    answer: next.faqSection?.items?.[index]?.answer || ''
  }))
  next.support.tips = alignPrimitiveList(content.support?.tips, next.support?.tips)

  return next
}
