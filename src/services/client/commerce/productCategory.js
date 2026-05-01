import { get } from '@/utils/clientRequest'

export const getProductCategoryTree = () => {
  return get('product-categories/tree')
}

export const getProductsByCategory = slug => {
  return get(`product-categories/${slug}/products`)
}