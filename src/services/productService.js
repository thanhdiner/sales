import { get, post } from '../utils/request'

//# client
export const getProducts = async () => {
  return await get('products')
}

export const getProductDetail = async slug => {
  return await get(`products/${slug}`)
}

//# admin
export const getAdminProducts = async (page = 1, limit = 10) => {
  return await get(`admin/products?page=${page}&limit=${limit}`)
}

export const createProduct = async data => {
  return await post('admin/products/create', data)
}
