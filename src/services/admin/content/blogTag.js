import { del, get, patch, post } from '@/utils/request'

const buildBlogTagQueryString = (params = {}) => {
  const searchParams = new URLSearchParams()
  if (params.keyword) searchParams.set('keyword', params.keyword)
  if (params.status) searchParams.set('status', params.status)
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const getBlogTags = params => get(`admin/blog-tags${buildBlogTagQueryString(params)}`)
export const createBlogTag = payload => post('admin/blog-tags', payload)
export const updateBlogTag = (id, payload) => patch(`admin/blog-tags/${id}`, payload)
export const deleteBlogTag = id => del(`admin/blog-tags/${id}`)
export const updateBlogTagStatus = (id, status) => patch(`admin/blog-tags/${id}/status`, { status })
