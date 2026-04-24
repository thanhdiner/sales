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
