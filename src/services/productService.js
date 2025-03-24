import { get } from '../utils/request'

export const getProducts = async () => {
  return await get('products')
}

export const getProductDetail = async slug => {
  return await get(`products/${slug}`)
}
