import { get, patch, post } from '@/utils/request'

//# client
export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const url = query ? `products?${query}` : 'products'
  return await get(url)
}

export const trackProductView = async (slug) => {
  try {
    return await post(`products/${slug}/view`)
  } catch {
    // Lỗi view tracking không nên ảnh hưởng UX
  }
}

export const getProductDetail = async slug => {
  return await get(`products/${slug}`)
}

export const getProductSuggestions = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return await get(`products/suggest?${query}`)
}

export const getRecommendations = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return await get(`products/recommendations?${query}`)
}

//# admin
//## Products
export const getAdminProducts = async ({ page = 1, limit = 10, sortField, sortOrder, ...rest }) => {
  const query = new URLSearchParams({
    page,
    limit,
    ...(sortField && sortOrder ? { sortField, sortOrder } : {}),
    ...rest
  }).toString()

  return await get(`admin/products?${query}`)
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

export const getProductById = async id => {
  return await get(`admin/products/${id}`)
}

export const updateProductById = async (id, data) => {
  return await patch(`admin/products/edit/${id}`, data)
}
