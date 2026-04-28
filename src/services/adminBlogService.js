import { del, get, patch, post } from '@/utils/request'

const buildBlogQueryString = (params = {}) => {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', params.page)
  if (params.limit) searchParams.set('limit', params.limit)
  if (params.keyword) searchParams.set('keyword', params.keyword)
  if (params.status) searchParams.set('status', params.status)
  if (params.category) searchParams.set('category', params.category)
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
