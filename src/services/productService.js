import { get } from '../utils/request'

export const getProducts = async () => {
  return await get('products')
}

export const getProductDetail = async id => {
  return await get(`products/${id}`)
}
