import { getLocalizedProductCategoryTitle as getLocalizedCategoryTitle } from '@/pages/admin/ProductCategories/utils/productCategoryLocalization'

const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasValue = value => {
  if (Array.isArray(value)) return value.length > 0
  return typeof value === 'string' && value.trim().length > 0
}

export const getLocalizedProductField = (product, field, language, fallback = '') => {
  if (!product) return fallback

  const baseValue = product[field]
  const translatedValue = isEnglishLanguage(language) ? product.translations?.en?.[field] : null

  if (hasValue(translatedValue)) return translatedValue
  if (hasValue(baseValue)) return baseValue

  return baseValue ?? fallback
}

export const getLocalizedProductTitle = (product, language, fallback = '') =>
  getLocalizedProductField(product, 'title', language, fallback)

export const getLocalizedProductDescription = (product, language, fallback = '') =>
  getLocalizedProductField(product, 'description', language, fallback)

export const getLocalizedProductContent = (product, language, fallback = '') =>
  getLocalizedProductField(product, 'content', language, fallback)

export const getLocalizedProductFeatures = (product, language, fallback = []) =>
  getLocalizedProductField(product, 'features', language, fallback)

export const getLocalizedProductDeliveryInstructions = (product, language, fallback = '') =>
  getLocalizedProductField(product, 'deliveryInstructions', language, fallback)

export const getLocalizedProductCategoryTitle = (product, language, fallback = '') => {
  const category = product?.productCategory

  if (!category || typeof category !== 'object') return category || fallback

  return getLocalizedCategoryTitle(category, language, category.title || fallback)
}

export const getLocalizedProduct = (product, language) => {
  if (!product) return product

  return {
    ...product,
    title: getLocalizedProductTitle(product, language, product.title || ''),
    description: getLocalizedProductDescription(product, language, product.description || ''),
    content: getLocalizedProductContent(product, language, product.content || ''),
    features: getLocalizedProductFeatures(product, language, product.features || []),
    deliveryInstructions: getLocalizedProductDeliveryInstructions(
      product,
      language,
      product.deliveryInstructions || ''
    ),
    productCategory:
      product.productCategory && typeof product.productCategory === 'object'
        ? {
            ...product.productCategory,
            title: getLocalizedProductCategoryTitle(product, language, product.productCategory.title || '')
          }
        : product.productCategory
  }
}
