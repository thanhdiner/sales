export const ADMIN_REVIEWS_PAGE_LIMIT = 15
export const ADMIN_REVIEWS_STATS_LIMIT = 10000
export const ADMIN_REVIEWS_SEARCH_DEBOUNCE_MS = 400

const DEFAULT_REVIEW_DISTRIBUTION = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0
}

export const createEmptyReviewStats = () => ({
  total: 0,
  avg: 0,
  replied: 0,
  dist: { ...DEFAULT_REVIEW_DISTRIBUTION }
})

export const calculateReviewStats = reviews => {
  const nextStats = createEmptyReviewStats()
  let totalRating = 0

  reviews.forEach(review => {
    const rating = Number(review?.rating) || 0

    if (nextStats.dist[rating] !== undefined) {
      nextStats.dist[rating] += 1
    }

    totalRating += rating

    if (review?.sellerReply?.content) {
      nextStats.replied += 1
    }
  })

  nextStats.total = reviews.length
  nextStats.avg = nextStats.total ? (totalRating / nextStats.total).toFixed(1) : 0

  return nextStats
}

export const getAdminReviewsQueryParams = ({ page, limit, rating, search } = {}) => {
  const params = new URLSearchParams()

  if (page !== undefined && page !== null) {
    params.set('page', String(page))
  }

  if (limit !== undefined && limit !== null) {
    params.set('limit', String(limit))
  }

  if (rating) {
    params.set('rating', String(rating))
  }

  if (search?.trim()) {
    params.set('search', search.trim())
  }

  return params.toString()
}

export const getReviewMediaItems = review => [
  ...(review?.images || []).map(url => ({ url, isVideo: false })),
  ...(review?.videos || []).map(url => ({ url, isVideo: true }))
]

const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

export const getLocalizedReviewProductTitle = (review, language, fallback = '') => {
  const product = review?.productId
  if (!product) return fallback

  const translatedTitle = isEnglishLanguage(language) ? product.translations?.en?.title : null

  if (hasText(translatedTitle)) return translatedTitle
  if (hasText(product.localizedTitle)) return product.localizedTitle
  if (hasText(product.title)) return product.title

  return product.slug || fallback
}

export const getLocalizedSellerReplyContent = (review, language, fallback = '') => {
  const sellerReply = review?.sellerReply
  if (!sellerReply) return fallback

  const translatedContent = isEnglishLanguage(language) ? sellerReply.translations?.en?.content : null

  if (hasText(translatedContent)) return translatedContent
  if (hasText(sellerReply.localizedContent)) return sellerReply.localizedContent
  if (hasText(sellerReply.content)) return sellerReply.content

  return fallback
}

export const getReviewReplyFormValues = review => ({
  content: review?.sellerReply?.content || '',
  translations: {
    en: {
      content: review?.sellerReply?.translations?.en?.content || ''
    }
  }
})

export const normalizeReviewReplyPayload = values => ({
  content: typeof values?.content === 'string' ? values.content.trim() : '',
  translations: {
    en: {
      content:
        typeof values?.translations?.en?.content === 'string'
          ? values.translations.en.content.trim()
          : ''
    }
  }
})
