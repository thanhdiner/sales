import { get } from '@/utils/clientRequest'

const buildBlogQueryString = (params = {}) => {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', params.page)
  if (params.limit) searchParams.set('limit', params.limit)
  if (params.keyword) searchParams.set('keyword', params.keyword)
  if (params.category) searchParams.set('category', params.category)

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const getBlogPosts = async params => {
  return await get(`blog${buildBlogQueryString(params)}`)
}

export const getBlogPostBySlug = async slug => {
  return await get(`blog/${slug}`)
}
