import { del, put } from '@/utils/request'

export const replyReview = (reviewId, payload) => {
  const body = typeof payload === 'string' ? { content: payload } : payload
  return put(`admin/reviews/${reviewId}/reply`, body)
}

export const deleteReply = reviewId => {
  return del(`admin/reviews/${reviewId}/reply`)
}

export const hideReview = (reviewId, payload = {}) => {
  return put(`admin/reviews/${reviewId}/hide`, payload)
}
