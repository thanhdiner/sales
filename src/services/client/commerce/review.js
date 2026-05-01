import { del, get, post, put } from '@/utils/clientRequest'

export {
  replyReview,
  deleteReply,
  hideReview,
  replyReview as adminReplyReview,
  deleteReply as adminDeleteReply
} from '@/services/admin/commerce/review'

export const getReviews = (productId, params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return get(`reviews/${productId}${qs ? `?${qs}` : ''}`)
}

export const createReview = (productId, formData) => {
  return post(`reviews/${productId}`, formData)
}

export const updateReview = (reviewId, formData) => {
  return put(`reviews/${reviewId}`, formData)
}

export const deleteReview = reviewId => {
  return del(`reviews/${reviewId}`)
}

export const voteReview = reviewId => {
  return post(`reviews/${reviewId}/vote`, {})
}