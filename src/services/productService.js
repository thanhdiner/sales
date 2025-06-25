import { get } from '../utils/request'

//# client
export const getProducts = async () => {
  return await get('products')
}

export const getProductDetail = async slug => {
  return await get(`products/${slug}`)
}

//# admin
export const getAdminProducts = async () => {
  return await get('admin/products')
}
