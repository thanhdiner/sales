import { get, patch } from '../utils/request'
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
