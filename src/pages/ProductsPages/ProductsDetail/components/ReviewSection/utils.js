export const REVIEW_LIMIT = 10

export const REVIEW_SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'helpful', label: 'Hữu ích nhất' },
  { value: 'highRating', label: 'Cao nhất' },
  { value: 'lowRating', label: 'Thấp nhất' }
]

export const DEFAULT_REVIEW_SUMMARY = {
  avgRating: 0,
  totalCount: 0,
  ratingDist: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
}

export const timeAgo = dateStr => {
  if (!dateStr) return ''

  const diff = Date.now() - new Date(dateStr)
  const m = Math.floor(diff / 60000)

  if (m < 1) return 'Vừa xong'
  if (m < 60) return `${m} phút trước`

  const h = Math.floor(m / 60)
  if (h < 24) return `${h} giờ trước`

  const d = Math.floor(h / 24)
  if (d < 30) return `${d} ngày trước`

  return new Date(dateStr).toLocaleDateString('vi-VN')
}

export const getReviewMedia = review => [
  ...(Array.isArray(review?.images) ? review.images : []).map(url => ({ url, isVideo: false })),
  ...(Array.isArray(review?.videos) ? review.videos : []).map(url => ({ url, isVideo: true }))
]

export const recalcReviewSummary = (prevSummary, addRating, removeRating) => {
  const dist = { ...DEFAULT_REVIEW_SUMMARY.ratingDist, ...(prevSummary?.ratingDist || {}) }

  if (removeRating) {
    dist[removeRating] = Math.max(0, (dist[removeRating] || 0) - 1)
  }

  if (addRating) {
    dist[addRating] = (dist[addRating] || 0) + 1
  }

  const totalCount = Object.values(dist).reduce((sum, count) => sum + count, 0)
  const avg = totalCount
    ? Object.entries(dist).reduce((sum, [rating, count]) => sum + Number(rating) * count, 0) / totalCount
    : 0

  return {
    avgRating: Math.round(avg * 10) / 10,
    totalCount,
    ratingDist: dist
  }
}
