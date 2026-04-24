import { get as getClient } from '@/utils/clientRequest'

export async function getProductCategoryTree() {
  return await getClient('product-categories/tree')
}

export async function getProductsByCategory(slug) {
  return await getClient(`product-categories/${slug}/products`)
}
