export const FALLBACK_IMAGE = '/images/herosection-aboutpage.jpg'
export const PAGE_SIZE_OPTIONS = [10, 20, 50]
export const MAX_IMAGE_SIZE_MB = 5

export const BLOG_FIELD_LIMITS = {
  title: 180,
  slug: 220,
  excerpt: 500,
  content: 20000,
  category: 80
}

export const defaultFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: '',
  tags: [],
  status: 'draft',
  isFeatured: false,
  publishedAt: null,
  thumbnail: [],
  translations: {
    en: {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: []
    }
  }
}

export const statusColor = {
  published: 'green',
  queued: 'blue',
  archived: 'volcano',
  draft: 'default'
}

export const hasText = value => typeof value === 'string' && value.trim().length > 0
export const getHtmlTextLength = value => String(value || '').replace(/<[^>]*>/g, '').length
export const getCharacterLimitHint = max => `0/${max}`

export function getLocalizedPost(post, language) {
  if (language !== 'en') return post

  const translation = post?.translations?.en || {}

  return {
    ...post,
    title: hasText(translation.title) ? translation.title : post.title,
    excerpt: hasText(translation.excerpt) ? translation.excerpt : post.excerpt,
    content: hasText(translation.content) ? translation.content : post.content,
    category: hasText(translation.category) ? translation.category : post.category,
    tags: Array.isArray(translation.tags) && translation.tags.length > 0 ? translation.tags : post.tags
  }
}

export function formatDate(value, language) {
  if (!value) return ''

  try {
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value))
  } catch {
    return ''
  }
}

export function getUploadFileList(post) {
  if (!post?.thumbnail) return []

  return [
    {
      uid: post._id || 'thumbnail',
      name: 'thumbnail',
      status: 'done',
      url: post.thumbnail
    }
  ]
}

export function appendFormData(formData, key, value) {
  if (value === undefined || value === null) {
    formData.append(key, '')
    return
  }

  formData.append(key, value)
}

export function buildBlogFormData(formValues, { fileList = [], oldThumbnail = '', thumbnailToDelete = '' } = {}) {
  const formData = new FormData()
  const publishedAt = formValues.publishedAt?.toISOString?.() || ''
  const thumbnailFile = fileList[0]?.originFileObj

  appendFormData(formData, 'title', formValues.title)
  appendFormData(formData, 'slug', formValues.slug)
  appendFormData(formData, 'excerpt', formValues.excerpt)
  appendFormData(formData, 'content', formValues.content)
  appendFormData(formData, 'category', formValues.category)
  appendFormData(formData, 'tags', JSON.stringify(formValues.tags || []))
  appendFormData(formData, 'status', formValues.status)
  appendFormData(formData, 'isFeatured', formValues.isFeatured ? 'true' : 'false')
  appendFormData(formData, 'publishedAt', publishedAt)
  appendFormData(formData, 'translations', JSON.stringify(formValues.translations || defaultFormValues.translations))

  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile)
    if (oldThumbnail) formData.append('oldImage', oldThumbnail)
  } else if (thumbnailToDelete) {
    formData.append('oldImage', thumbnailToDelete)
    formData.append('deleteImage', 'true')
  }

  return formData
}

export const getAdminBlogPopupContainer = trigger =>
  trigger?.closest?.('.admin-blog-edit-page') || trigger?.closest?.('.admin-blog-page') || document.body
