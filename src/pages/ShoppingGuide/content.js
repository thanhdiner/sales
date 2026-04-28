import {
  shoppingGuideDetailedSteps,
  shoppingGuideFaqData,
  shoppingGuideHeroImage,
  shoppingGuidePaymentMethods,
  shoppingGuideSmartTips,
  shoppingGuideSteps,
  shoppingGuideTipsImage
} from './data'

const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

const firstText = (...values) => {
  const found = values.find(hasText)
  return found ?? ''
}

const isLegacyGeneratedImage = value =>
  typeof value === 'string' && /lh3\.googleusercontent\.com\/aida-public/i.test(value)

const firstImage = (...values) => firstText(...values.filter(value => !isLegacyGeneratedImage(value)))

const asArray = value => (Array.isArray(value) ? value : [])

const getPath = (source, path) =>
  String(path || '')
    .split('.')
    .reduce((result, key) => (result == null ? result : result[key]), source)

const getLocalizedRoot = (config, language) => (isEnglishLanguage(language) ? config?.translations?.en || {} : {})

const getLocalizedText = (config, localizedRoot, path, fallback) =>
  firstText(getPath(localizedRoot, path), getPath(config, path), fallback)

const getConfiguredList = (config, localizedRoot, path) => {
  const localized = getPath(localizedRoot, path)
  const base = getPath(config, path)

  return {
    localizedItems: Array.isArray(localized) ? localized : [],
    baseItems: Array.isArray(base) ? base : [],
    hasConfiguredItems: Array.isArray(localized) || Array.isArray(base)
  }
}

const tArray = (t, key) => {
  const value = t(key, { returnObjects: true })
  return Array.isArray(value) ? value : []
}

const maxArrayLength = (...arrays) => Math.max(0, ...arrays.map(items => asArray(items).length))

const resolveTextList = (config, localizedRoot, key, fallbackItems) => {
  const { localizedItems, baseItems, hasConfiguredItems } = getConfiguredList(config, localizedRoot, key)
  const total = hasConfiguredItems ? maxArrayLength(localizedItems, baseItems) : asArray(fallbackItems).length

  return Array.from({ length: total })
    .map((_, index) => firstText(localizedItems[index], baseItems[index], fallbackItems[index]))
    .filter(hasText)
}

const resolveSteps = (config, localizedRoot, t) => {
  const { localizedItems, baseItems, hasConfiguredItems } = getConfiguredList(config, localizedRoot, 'steps')
  const total = hasConfiguredItems ? maxArrayLength(localizedItems, baseItems) : shoppingGuideSteps.length

  return Array.from({ length: total })
    .map((_, index) => {
      const fallback = shoppingGuideSteps[index] || {}
      const base = baseItems[index] || {}
      const localized = localizedItems[index] || {}
      const title = firstText(localized.title, base.title, fallback.titleKey ? t(fallback.titleKey) : '')
      const content = firstText(localized.content, base.content, fallback.contentKey ? t(fallback.contentKey) : '')

      if (!hasText(title) && !hasText(content)) return null

      return {
        ...fallback,
        ...base,
        ...localized,
        title,
        content
      }
    })
    .filter(Boolean)
}

const resolveDetailedSteps = (config, localizedRoot, t) => {
  const { localizedItems, baseItems, hasConfiguredItems } = getConfiguredList(config, localizedRoot, 'detailedSteps')
  const total = hasConfiguredItems ? maxArrayLength(localizedItems, baseItems) : shoppingGuideDetailedSteps.length

  return Array.from({ length: total })
    .map((_, index) => {
      const fallback = shoppingGuideDetailedSteps[index] || {}
      const base = baseItems[index] || {}
      const localized = localizedItems[index] || {}
      const title = firstText(localized.title, base.title, fallback.titleKey ? t(fallback.titleKey) : '')
      const description = firstText(
        localized.description,
        base.description,
        fallback.descriptionKey ? t(fallback.descriptionKey) : ''
      )

      if (!hasText(title) && !hasText(description)) return null

      return {
        ...fallback,
        ...base,
        ...localized,
        id: firstText(localized.id, base.id, fallback.idKey ? t(fallback.idKey) : ''),
        title,
        description,
        chips:
          asArray(localized.chips).length > 0
            ? localized.chips
            : asArray(base.chips).length > 0
              ? base.chips
              : fallback.chipsKey
                ? tArray(t, fallback.chipsKey)
                : [],
        checks:
          asArray(localized.checks).length > 0
            ? localized.checks
            : asArray(base.checks).length > 0
              ? base.checks
              : fallback.checksKey
                ? tArray(t, fallback.checksKey)
                : [],
        note: firstText(localized.note, base.note, fallback.noteKey ? t(fallback.noteKey) : ''),
        image: firstImage(localized.image, base.image, fallback.image),
        reverse: typeof base.reverse === 'boolean' ? base.reverse : Boolean(fallback.reverse)
      }
    })
    .filter(Boolean)
}

const resolvePaymentMethods = (config, localizedRoot, t) => {
  const { localizedItems, baseItems, hasConfiguredItems } = getConfiguredList(config, localizedRoot, 'paymentMethods')
  const total = hasConfiguredItems ? maxArrayLength(localizedItems, baseItems) : shoppingGuidePaymentMethods.length

  return Array.from({ length: total })
    .map((_, index) => {
      const fallback = shoppingGuidePaymentMethods[index] || {}
      const base = baseItems[index] || {}
      const localized = localizedItems[index] || {}
      const name = firstText(localized.name, base.name, fallback.nameKey ? t(fallback.nameKey) : '')
      const desc = firstText(localized.desc, base.desc, fallback.descKey ? t(fallback.descKey) : '')

      if (!hasText(name) && !hasText(desc)) return null

      return {
        ...fallback,
        ...base,
        ...localized,
        name,
        desc,
        badges:
          asArray(localized.badges).length > 0
            ? localized.badges
            : asArray(base.badges).length > 0
              ? base.badges
              : asArray(fallback.badges),
        popular: typeof base.popular === 'boolean' ? base.popular : Boolean(fallback.popular)
      }
    })
    .filter(Boolean)
}

const resolveFaq = (config, localizedRoot, t) => {
  const { localizedItems, baseItems, hasConfiguredItems } = getConfiguredList(config, localizedRoot, 'faq')
  const total = hasConfiguredItems ? maxArrayLength(localizedItems, baseItems) : shoppingGuideFaqData.length

  return Array.from({ length: total })
    .map((_, index) => {
      const fallback = shoppingGuideFaqData[index] || {}
      const base = baseItems[index] || {}
      const localized = localizedItems[index] || {}
      const question = firstText(localized.question, base.question, fallback.questionKey ? t(fallback.questionKey) : '')
      const answer = firstText(localized.answer, base.answer, fallback.answerKey ? t(fallback.answerKey) : '')

      if (!hasText(question) && !hasText(answer)) return null

      return {
        ...fallback,
        ...base,
        ...localized,
        question,
        answer
      }
    })
    .filter(Boolean)
}

export const getShoppingGuideContent = ({ websiteConfig, language, t }) => {
  const config = websiteConfig?.shoppingGuide || {}
  const localizedRoot = getLocalizedRoot(config, language)

  return {
    seo: {
      title: getLocalizedText(config, localizedRoot, 'seo.title', t('seo.title')),
      description: getLocalizedText(config, localizedRoot, 'seo.description', t('seo.description'))
    },
    hero: {
      eyebrow: getLocalizedText(config, localizedRoot, 'hero.eyebrow', t('hero.eyebrow')),
      title: getLocalizedText(config, localizedRoot, 'hero.title', t('hero.title')),
      description: getLocalizedText(config, localizedRoot, 'hero.description', t('hero.description')),
      registerButton: getLocalizedText(config, localizedRoot, 'hero.registerButton', t('hero.registerButton')),
      guideButton: getLocalizedText(config, localizedRoot, 'hero.guideButton', t('hero.guideButton')),
      imageAlt: getLocalizedText(config, localizedRoot, 'hero.imageAlt', t('hero.imageAlt')),
      image: firstImage(localizedRoot.hero?.image, config.hero?.image, shoppingGuideHeroImage)
    },
    processSection: {
      eyebrow: getLocalizedText(config, localizedRoot, 'processSection.eyebrow', t('processSection.eyebrow')),
      title: getLocalizedText(config, localizedRoot, 'processSection.title', t('processSection.title')),
      previous: getLocalizedText(config, localizedRoot, 'processSection.previous', t('processSection.previous')),
      next: getLocalizedText(config, localizedRoot, 'processSection.next', t('processSection.next')),
      stepAria: getLocalizedText(config, localizedRoot, 'processSection.stepAria', t('processSection.stepAria'))
    },
    steps: resolveSteps(config, localizedRoot, t),
    detailedStepsSection: {
      eyebrow: getLocalizedText(config, localizedRoot, 'detailedStepsSection.eyebrow', t('detailedStepsSection.eyebrow')),
      title: getLocalizedText(config, localizedRoot, 'detailedStepsSection.title', t('detailedStepsSection.title'))
    },
    detailedSteps: resolveDetailedSteps(config, localizedRoot, t),
    paymentSection: {
      eyebrow: getLocalizedText(config, localizedRoot, 'paymentSection.eyebrow', t('paymentSection.eyebrow')),
      title: getLocalizedText(config, localizedRoot, 'paymentSection.title', t('paymentSection.title')),
      description: getLocalizedText(config, localizedRoot, 'paymentSection.description', t('paymentSection.description')),
      popular: getLocalizedText(config, localizedRoot, 'paymentSection.popular', t('paymentSection.popular')),
      securityNote: getLocalizedText(config, localizedRoot, 'paymentSection.securityNote', t('paymentSection.securityNote'))
    },
    paymentMethods: resolvePaymentMethods(config, localizedRoot, t),
    faqSection: {
      eyebrow: getLocalizedText(config, localizedRoot, 'faqSection.eyebrow', t('faqSection.eyebrow')),
      title: getLocalizedText(config, localizedRoot, 'faqSection.title', t('faqSection.title')),
      toggle: getLocalizedText(config, localizedRoot, 'faqSection.toggle', t('faqSection.toggle'))
    },
    faq: resolveFaq(config, localizedRoot, t),
    tipsSection: {
      eyebrow: getLocalizedText(config, localizedRoot, 'tipsSection.eyebrow', t('tipsSection.eyebrow')),
      title: getLocalizedText(config, localizedRoot, 'tipsSection.title', t('tipsSection.title')),
      description: getLocalizedText(config, localizedRoot, 'tipsSection.description', t('tipsSection.description')),
      imageAlt: getLocalizedText(config, localizedRoot, 'tipsSection.imageAlt', t('tipsSection.imageAlt')),
      image: firstImage(localizedRoot.tipsSection?.image, config.tipsSection?.image, shoppingGuideTipsImage)
    },
    smartTips: resolveTextList(
      config,
      localizedRoot,
      'smartTips',
      shoppingGuideSmartTips.map(tipKey => t(tipKey))
    ),
    supportSection: {
      eyebrow: getLocalizedText(config, localizedRoot, 'supportSection.eyebrow', t('supportSection.eyebrow')),
      title: getLocalizedText(config, localizedRoot, 'supportSection.title', t('supportSection.title')),
      phoneLabel: getLocalizedText(config, localizedRoot, 'supportSection.phoneLabel', t('supportSection.phoneLabel')),
      emailLabel: getLocalizedText(config, localizedRoot, 'supportSection.emailLabel', t('supportSection.emailLabel')),
      timeLabel: getLocalizedText(config, localizedRoot, 'supportSection.timeLabel', t('supportSection.timeLabel')),
      workingTime: getLocalizedText(config, localizedRoot, 'supportSection.workingTime', t('supportSection.workingTime')),
      description: getLocalizedText(config, localizedRoot, 'supportSection.description', t('supportSection.description')),
      browseProducts: getLocalizedText(config, localizedRoot, 'supportSection.browseProducts', t('supportSection.browseProducts')),
      viewCoupons: getLocalizedText(config, localizedRoot, 'supportSection.viewCoupons', t('supportSection.viewCoupons'))
    }
  }
}
