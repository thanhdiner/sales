import { get } from '@/utils/clientRequest'

const buildBlogQueryString = (params = {}) => {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', params.page)
  if (params.limit) searchParams.set('limit', params.limit)
  if (params.keyword) searchParams.set('keyword', params.keyword)
  if (params.search) searchParams.set('search', params.search)
  if (params.category) searchParams.set('category', params.category)
  if (params.tag) searchParams.set('tag', params.tag)

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const getBlogPosts = params => {
  return get(`blog${buildBlogQueryString(params)}`)
}

export const getBlogPostBySlug = slug => {
  return get(`blog/${slug}`)
}

export const getBlogCategories = () => {
  return get('blog-categories')
}

export const getBlogTags = () => {
  return get('blog-tags')
}