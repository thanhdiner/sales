import { del, get, patch, post } from '@/utils/request'

const getQuickRepliesQueryString = params => {
  const searchParams = new URLSearchParams()

  if (params?.page) searchParams.set('page', params.page)
  if (params?.limit) searchParams.set('limit', params.limit)
  if (params?.search) searchParams.set('search', params.search)
  if (params?.category) searchParams.set('category', params.category)
  if (params?.status) searchParams.set('status', params.status)
  if (params?.language) searchParams.set('language', params.language)

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const getQuickReplies = params => get(`admin/quick-replies${getQuickRepliesQueryString(params)}`)
export const getActiveQuickReplies = params => get(`admin/quick-replies/active${getQuickRepliesQueryString(params)}`)
export const createQuickReply = payload => post('admin/quick-replies', payload)
export const updateQuickReply = (id, payload) => patch(`admin/quick-replies/${id}`, payload)
export const setQuickReplyStatus = (id, isActive) => patch(`admin/quick-replies/${id}/status`, { isActive })
export const deleteQuickReply = id => patch(`admin/quick-replies/${id}/delete`)
export const recordQuickReplyUsage = id => patch(`admin/quick-replies/${id}/usage`)

const getQuickReplyCategoriesQueryString = params => {
  const searchParams = new URLSearchParams()

  if (params?.search) searchParams.set('search', params.search)
  if (params?.isActive !== undefined && params?.isActive !== '') {
    searchParams.set('isActive', params.isActive)
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const getQuickReplyCategories = params => get(`admin/quick-reply-categories${getQuickReplyCategoriesQueryString(params)}`)
export const createQuickReplyCategory = payload => post('admin/quick-reply-categories', payload)
export const updateQuickReplyCategory = (id, payload) => patch(`admin/quick-reply-categories/${id}`, payload)
export const deleteQuickReplyCategory = id => del(`admin/quick-reply-categories/${id}`)
