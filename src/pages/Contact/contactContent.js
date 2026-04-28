import { faqKeys, sellers, workingHours } from './constants'

const DEFAULT_LINKS = {
  zaloUrl: 'https://zalo.me/0823387108',
  emailUrl: 'mailto:smartmallhq@gmail.com',
  productsUrl: '/products'
}

const getMethodType = method => {
  const title = String(method?.title || '').toLowerCase()

  if (title.includes('zalo')) return 'zalo'
  if (title.includes('facebook')) return 'facebook'
  if (title.includes('mail')) return 'email'

  return 'link'
}

const hasValue = value => value !== undefined && value !== null

function mergeFallback(fallback, value) {
  if (Array.isArray(fallback)) {
    return Array.isArray(value) ? value : fallback
  }

  if (fallback && typeof fallback === 'object') {
    const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
    return Object.keys(fallback).reduce((merged, key) => {
      merged[key] = mergeFallback(fallback[key], source[key])
      return merged
    }, { ...source })
  }

  return hasValue(value) ? value : fallback
}

export function buildFallbackContactContent(t) {
  return {
    seo: {
      title: t('seo.title'),
      description: t('seo.description')
    },
    links: DEFAULT_LINKS,
    hero: {
      eyebrow: t('heroSection.eyebrow'),
      titleLine1: t('heroSection.titleLine1'),
      titleLine2: t('heroSection.titleLine2'),
      description: t('heroSection.description'),
      zaloButton: t('heroSection.zaloButton'),
      emailButton: t('heroSection.emailButton'),
      imageUrl: '/images/herosection-aboutpage.jpg',
      imageAlt: t('heroSection.visual.imageAlt'),
      topics: [
        t('heroSection.topics.productAdvice'),
        t('heroSection.topics.orderSupport'),
        t('heroSection.topics.quickResponse')
      ],
      visual: {
        badge: t('heroSection.visual.badge'),
        eyebrow: t('heroSection.visual.eyebrow'),
        description: t('heroSection.visual.description'),
        button: t('heroSection.visual.button')
      }
    },
    highlightsSection: {
      eyebrow: t('highlightsSection.eyebrow'),
      title: t('highlightsSection.title'),
      description: t('highlightsSection.description'),
      items: [
        { value: '< 3h', label: t('highlightsSection.items.responseTime') },
        { value: '100%', label: t('highlightsSection.items.security') },
        { value: '24/7', label: t('highlightsSection.items.support') }
      ]
    },
    contactMethodsSection: {
      eyebrow: t('contactMethodsSection.eyebrow'),
      title: t('contactMethodsSection.title'),
      description: t('contactMethodsSection.description'),
      note: t('sellers.note'),
      sellers: sellers.map(seller => ({
        name: seller.name,
        role: seller.roleKey ? t(seller.roleKey) : seller.role,
        avatar: seller.avatar,
        methods: seller.methods.map(method => ({
          type: getMethodType(method),
          title: method.title,
          value: method.value,
          actionLabel: method.actionKey ? t(method.actionKey) : method.actionLabel,
          link: method.link
        }))
      }))
    },
    formScheduleSection: {
      eyebrow: t('formScheduleSection.eyebrow'),
      title: t('formScheduleSection.title'),
      description: t('formScheduleSection.description')
    },
    workingHoursCard: {
      title: t('workingHoursCard.title'),
      description: t('workingHoursCard.description'),
      noteTitle: t('workingHoursCard.noteTitle'),
      noteDescription: t('workingHoursCard.noteDescription'),
      zaloButton: t('workingHoursCard.zaloButton'),
      emailButton: t('workingHoursCard.emailButton'),
      items: workingHours.map(schedule => ({
        type: schedule.type,
        day: schedule.dayKey ? t(schedule.dayKey) : schedule.day,
        time: schedule.time
      }))
    },
    faqSection: {
      eyebrow: t('faqSection.eyebrow'),
      title: t('faqSection.title'),
      description: t('faqSection.description'),
      items: faqKeys.map(key => ({
        question: t(`faqs.${key}.question`),
        answer: t(`faqs.${key}.answer`)
      }))
    },
    faqHelpCard: {
      eyebrow: t('faqHelpCard.eyebrow'),
      title: t('faqHelpCard.title'),
      description: t('faqHelpCard.description'),
      zaloButton: t('faqHelpCard.zaloButton'),
      emailButton: t('faqHelpCard.emailButton'),
      tip: t('faqHelpCard.tip')
    },
    ctaSection: {
      eyebrow: t('ctaSection.eyebrow'),
      title: t('ctaSection.title'),
      description: t('ctaSection.description'),
      chatButton: t('ctaSection.chatButton'),
      productsButton: t('ctaSection.productsButton')
    }
  }
}

export function normalizeContactContent(content, t) {
  return mergeFallback(buildFallbackContactContent(t), content)
}
