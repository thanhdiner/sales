import { get, patch, post } from '@/utils/request'

export const getProducts = ({ page = 1, limit = 10, sortField, sortOrder, ...rest } = {}) => {
  const query = new URLSearchParams({
    page,
    limit,
    ...(sortField && sortOrder ? { sortField, sortOrder } : {}),
    ...rest
  }).toString()

  return get(`admin/products?${query}`)
}

export const createProduct = data => {
  return post('admin/products/create', data)
}

export const deleteProduct = id => {
  return patch(`admin/products/delete/${id}`, { deleted: true })
}

export const toggleProductStatus = (id, status) => {
  return patch(`admin/products/changeStatus/${id}`, { status })
}

export const deleteManyProducts = ids => {
  return patch('admin/products/delete-many', { ids })
}

export const changeManyProductStatuses = (ids, status) => {
  return patch('admin/products/change-status-many', { ids, status })
}

export const changeManyProductPositions = data => {
  return patch('admin/products/change-position-many', { data })
}

export const changeStatusManyProducts = changeManyProductStatuses
export const changePositionManyProducts = changeManyProductPositions

export const getProduct = id => {
  return get(`admin/products/${id}`)
}

export const updateProduct = (id, data) => {
  return patch(`admin/products/edit/${id}`, data)
}

export const getProductById = getProduct
export const updateProductById = updateProduct

export const generateProductContent = payload => {
  return post('admin/product-content-assistant/generate', payload)
}
