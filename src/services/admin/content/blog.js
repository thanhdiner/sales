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

export const getBlogPosts = params => {
  return get(`admin/blog${buildBlogQueryString(params)}`)
}

export const getBlogPost = id => {
  return get(`admin/blog/${id}`)
}

export const createBlogPost = formData => {
  return post('admin/blog', formData)
}

export const updateBlogPost = (id, formData) => {
  return patch(`admin/blog/${id}`, formData)
}

export const uploadBlogMedia = file => {
  const formData = new FormData()
  formData.append('media', file)

  return post('admin/blog/media', formData)
}

export const deleteBlogPost = id => {
  return del(`admin/blog/${id}`)
}

export const approveAndQueueBlogPost = (id, payload = {}) => {
  return patch(`admin/blog/${id}/approve-queue`, payload)
}

export const approveAndScheduleBlogPost = (id, payload = {}) => {
  return patch(`admin/blog/${id}/schedule`, payload)
}

export const publishBlogPostNow = id => {
  return patch(`admin/blog/${id}/publish-now`)
}

export const rejectBlogPost = id => {
  return patch(`admin/blog/${id}/reject`)
}

export const markBlogPostNeedsEdit = id => {
  return patch(`admin/blog/${id}/needs-edit`)
}

export const archiveBlogPost = id => {
  return patch(`admin/blog/${id}/archive`)
}

export const getBlogPublishQueue = params => {
  return get(`admin/blog-publish-queue${buildBlogQueryString(params)}`)
}

export const generateBlogDrafts = payload => {
  return post('admin/blog-agent/generate-drafts', payload)
}

export const getBlogAgentLogs = params => {
  return get(`admin/blog-agent/logs${buildBlogQueryString(params)}`)
}

export const getBlogAgentBatches = params => {
  return get(`admin/blog-agent/batches${buildBlogQueryString(params)}`)
}
