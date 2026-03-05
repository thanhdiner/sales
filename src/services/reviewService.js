import { get, post, put, del } from '../utils/clientRequest'
import { put as adminPut, del as adminDel } from '../utils/request'

// Read reviews – sends auth token if present (backend is optional-auth, marks isVoted/isOwner)
export const getReviews = (productId, params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return get(`reviews/${productId}${qs ? '?' + qs : ''}`)
}

// Auth-required writes
export const createReview = (productId, formData) => post(`reviews/${productId}`, formData)
export const updateReview = (reviewId, formData) => put(`reviews/${reviewId}`, formData)
export const deleteReview = reviewId => del(`reviews/${reviewId}`)
export const voteReview = reviewId => post(`reviews/${reviewId}/vote`, {})

// Admin seller reply (uses admin JWT)
export const adminReplyReview = (reviewId, content) =>
  adminPut(`admin/reviews/${reviewId}/reply`, { content })
export const adminDeleteReply = reviewId => adminDel(`admin/reviews/${reviewId}/reply`)
