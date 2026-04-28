import { del, get, patch, post } from '@/utils/request'

const buildBlogQueryString = (params = {}) => {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', params.page)
  if (params.limit) searchParams.set('limit', params.limit)
  if (params.keyword) searchParams.set('keyword', params.keyword)
  if (params.status) searchParams.set('status', params.status)
  if (params.reviewStatus) searchParams.set('reviewStatus', params.reviewStatus)
  if (params.source) searchParams.set('source', params.source)
  if (params.category) searchParams.set('category', params.category)
  if (params.tag) searchParams.set('tag', params.tag)
  if (params.duplicateRisk) searchParams.set('duplicateRisk', params.duplicateRisk)
  if (params.missingTranslation !== undefined && params.missingTranslation !== '') {
    searchParams.set('missingTranslation', params.missingTranslation)
  }
  if (params.isFeatured !== undefined && params.isFeatured !== '') {
    searchParams.set('isFeatured', params.isFeatured)
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const getAdminBlogPosts = async params => {
  return await get(`admin/blog${buildBlogQueryString(params)}`)
}

export const getAdminBlogPost = async id => {
  return await get(`admin/blog/${id}`)
}

export const createAdminBlogPost = async formData => {
  return await post('admin/blog', formData)
}

export const updateAdminBlogPost = async (id, formData) => {
  return await patch(`admin/blog/${id}`, formData)
}

export const deleteAdminBlogPost = async id => {
  return await del(`admin/blog/${id}`)
}

export const approveAndQueueAdminBlogPost = async (id, payload = {}) => {
  return await patch(`admin/blog/${id}/approve-queue`, payload)
}

export const approveAndScheduleAdminBlogPost = async (id, payload = {}) => {
  return await patch(`admin/blog/${id}/schedule`, payload)
}

export const publishAdminBlogPostNow = async id => {
  return await patch(`admin/blog/${id}/publish-now`)
}

export const rejectAdminBlogPost = async id => {
  return await patch(`admin/blog/${id}/reject`)
}

export const markAdminBlogPostNeedsEdit = async id => {
  return await patch(`admin/blog/${id}/needs-edit`)
}

export const archiveAdminBlogPost = async id => {
  return await patch(`admin/blog/${id}/archive`)
}

export const getAdminBlogPublishQueue = async params => {
  return await get(`admin/blog-publish-queue${buildBlogQueryString(params)}`)
}

export const generateAdminBlogDrafts = async payload => {
  return await post('admin/blog-agent/generate-drafts', payload)
}

export const getAdminBlogAgentLogs = async params => {
  return await get(`admin/blog-agent/logs${buildBlogQueryString(params)}`)
}

export const getAdminBlogAgentBatches = async params => {
  return await get(`admin/blog-agent/batches${buildBlogQueryString(params)}`)
}
