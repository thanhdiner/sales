const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

export const getLocalizedProductCategoryField = (category, field, language, fallback = '') => {
  if (!category) return fallback

  const baseValue = category[field]
  const translatedValue = isEnglishLanguage(language) ? category.translations?.en?.[field] : null

  if (hasText(translatedValue)) return translatedValue
  if (hasText(baseValue)) return baseValue

  return baseValue ?? fallback
}

export const getLocalizedProductCategoryTitle = (category, language, fallback = '') =>
  getLocalizedProductCategoryField(category, 'title', language, fallback)

export const getLocalizedProductCategoryDescription = (category, language, fallback = '') =>
  getLocalizedProductCategoryField(category, 'description', language, fallback)

export const getLocalizedProductCategoryContent = (category, language, fallback = '') =>
  getLocalizedProductCategoryField(category, 'content', language, fallback)

export const getLocalizedProductCategoryParentTitle = (category, language, fallback = '') => {
  const parent = category?.parent_id
  if (!parent || typeof parent !== 'object') return fallback
  return getLocalizedProductCategoryTitle(parent, language, fallback)
}

export const getLocalizedProductCategory = (category, language) => {
  if (!category) return category

  return {
    ...category,
    title: getLocalizedProductCategoryTitle(category, language, category.title || ''),
    description: getLocalizedProductCategoryDescription(category, language, category.description || ''),
    content: getLocalizedProductCategoryContent(category, language, category.content || ''),
    parent_id:
      category.parent_id && typeof category.parent_id === 'object'
        ? getLocalizedProductCategory(category.parent_id, language)
        : category.parent_id
  }
}

export const getLocalizedProductCategoryTree = (items = [], language) =>
  (Array.isArray(items) ? items : []).map(item => ({
    ...item,
    title: getLocalizedProductCategoryTitle(item, language, item.title || item.value || ''),
    children: getLocalizedProductCategoryTree(item.children, language)
  }))
