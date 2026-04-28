import { get, post, put, del } from '../utils/clientRequest'
import { put as adminPut, del as adminDel } from '../utils/request'

export const getReviews = (productId, params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return get(`reviews/${productId}${qs ? '?' + qs : ''}`)
}

export const createReview = (productId, formData) => post(`reviews/${productId}`, formData)
export const updateReview = (reviewId, formData) => put(`reviews/${reviewId}`, formData)
export const deleteReview = reviewId => del(`reviews/${reviewId}`)
export const voteReview = reviewId => post(`reviews/${reviewId}/vote`, {})

export const adminReplyReview = (reviewId, payload) =>
  adminPut(`admin/reviews/${reviewId}/reply`, typeof payload === 'string' ? { content: payload } : payload)
export const adminDeleteReply = reviewId => adminDel(`admin/reviews/${reviewId}/reply`)
export const adminHideReview = (reviewId, payload = {}) => adminPut(`admin/reviews/${reviewId}/hide`, payload)
