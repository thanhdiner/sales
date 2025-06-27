import { get, patch, post } from '../utils/request'

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

export const deleteProduct = async id => {
  return await patch(`admin/products/delete/${id}`, {
    deleted: true
  })
}

export const toggleProductStatus = async (id, status) => {
  return await patch(`admin/products/changeStatus/${id}`, {
    status
  })
}

export const deleteManyProducts = async ids => {
  return await patch('admin/products/delete-many', {
    ids
  })
}

export const changeStatusManyProducts = async (ids, status) => {
  return await patch('admin/products/change-status-many', {
    ids,
    status
  })
}

export const changePositionManyProducts = async data => {
  return await patch(`admin/products/change-position-many`, {
    data
  })
}
