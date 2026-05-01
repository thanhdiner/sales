import { del, get, patch, post } from '@/utils/request'

const buildQuickRepliesQueryString = params => {
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

const buildQuickReplyCategoriesQueryString = params => {
  const searchParams = new URLSearchParams()

  if (params?.search) searchParams.set('search', params.search)
  if (params?.isActive !== undefined && params?.isActive !== '') {
    searchParams.set('isActive', params.isActive)
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const getQuickReplies = params => {
  return get(`admin/quick-replies${buildQuickRepliesQueryString(params)}`)
}

export const getActiveQuickReplies = params => {
  return get(`admin/quick-replies/active${buildQuickRepliesQueryString(params)}`)
}

export const createQuickReply = payload => {
  return post('admin/quick-replies', payload)
}

export const updateQuickReply = (id, payload) => {
  return patch(`admin/quick-replies/${id}`, payload)
}

export const setQuickReplyStatus = (id, isActive) => {
  return patch(`admin/quick-replies/${id}/status`, { isActive })
}

export const deleteQuickReply = id => {
  return patch(`admin/quick-replies/${id}/delete`)
}

export const recordQuickReplyUsage = id => {
  return patch(`admin/quick-replies/${id}/usage`)
}

export const getQuickReplyCategories = params => {
  return get(`admin/quick-reply-categories${buildQuickReplyCategoriesQueryString(params)}`)
}

export const createQuickReplyCategory = payload => {
  return post('admin/quick-reply-categories', payload)
}

export const updateQuickReplyCategory = (id, payload) => {
  return patch(`admin/quick-reply-categories/${id}`, payload)
}

export const deleteQuickReplyCategory = id => {
  return del(`admin/quick-reply-categories/${id}`)
}
