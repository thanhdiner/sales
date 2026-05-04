import { del, get, patch, post } from '@/utils/request'

export const getBlogCategories = params => {
  const searchParams = new URLSearchParams()
  if (params?.keyword) searchParams.set('keyword', params.keyword)
  if (params?.isActive !== undefined && params.isActive !== '') searchParams.set('isActive', params.isActive)
  const query = searchParams.toString()
  return get(`admin/blog-categories${query ? `?${query}` : ''}`)
}

export const createBlogCategory = payload => post('admin/blog-categories', payload)
export const updateBlogCategory = (id, payload) => patch(`admin/blog-categories/${id}`, payload)
export const deleteBlogCategory = id => del(`admin/blog-categories/${id}`)
