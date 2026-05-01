import { get, patch, post } from '@/utils/request'

export const getProductCategories = ({ page = 1, limit = 10, sortField, sortOrder, ...rest } = {}) => {
  const query = new URLSearchParams({
    page,
    limit,
    ...(sortField && sortOrder ? { sortField, sortOrder } : {}),
    ...rest
  }).toString()

  return get(`admin/product-categories?${query}`)
}

export const getProductCategoryTree = () => {
  return get('admin/product-categories/tree')
}

export const toggleProductCategoryStatus = (id, status) => {
  return patch(`admin/product-categories/changeStatus/${id}`, { status })
}

export const deleteProductCategory = id => {
  return patch(`admin/product-categories/delete/${id}`, { deleted: true })
}

export const deleteManyProductCategories = ids => {
  return patch('admin/product-categories/delete-many', { ids })
}

export const changeManyProductCategoryStatuses = (ids, status) => {
  return patch('admin/product-categories/change-status-many', { ids, status })
}

export const changeManyProductCategoryPositions = data => {
  return patch('admin/product-categories/change-position-many', { data })
}

export const changeStatusManyProductCategories = changeManyProductCategoryStatuses
export const changePositionManyProductCategories = changeManyProductCategoryPositions

export const createProductCategory = data => {
  return post('admin/product-categories/create', data)
}

export const getProductCategory = id => {
  return get(`admin/product-categories/${id}`)
}

export const updateProductCategory = (id, data) => {
  return patch(`admin/product-categories/edit/${id}`, data)
}

export const getProductCategoryById = getProductCategory
export const updateProductCategoryById = updateProductCategory
