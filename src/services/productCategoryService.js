import { get, patch, post } from '../utils/request'
import { get as getClient } from '../utils/clientRequest'

//# client
export async function getProductCategoryTree() {
  return await getClient('product-categories/tree')
}

export async function getProductsByCategory(slug) {
  return await getClient(`product-categories/${slug}/products`)
}

//# admin

//# Product Categories
export const getAdminProductCategories = async ({ page = 1, limit = 10, sortField, sortOrder, ...rest }) => {
  const query = new URLSearchParams({
    page,
    limit,
    ...(sortField && sortOrder ? { sortField, sortOrder } : {}),
    ...rest
  }).toString()

  return await get(`admin/product-categories?${query}`)
}

export async function getAdminProductCategoryTree() {
  return await get('admin/product-categories/tree')
}

export const toggleProductCategoryStatus = async (id, status) => {
  return await patch(`admin/product-categories/changeStatus/${id}`, {
    status
  })
}

export const deleteProductCategory = async id => {
  return await patch(`admin/product-categories/delete/${id}`, {
    deleted: true
  })
}

export const deleteManyProductCategories = async ids => {
  return await patch('admin/product-categories/delete-many', {
    ids
  })
}

export const changeStatusManyProductCategories = async (ids, status) => {
  return await patch('admin/product-categories/change-status-many', {
    ids,
    status
  })
}

export const changePositionManyProductCategories = async data => {
  return await patch(`admin/product-categories/change-position-many`, {
    data
  })
}

export const createProductCategory = async data => {
  return await post('admin/product-categories/create', data)
}

export const getProductCategoryById = async id => {
  return await get(`admin/product-categories/${id}`)
}

export const updateProductCategoryById = async (id, data) => {
  return await patch(`admin/product-categories/edit/${id}`, data)
}
