import { del, get, patch, post } from '@/utils/request'

const API_BASE_URL = 'admin/flash-sales'

export const getFlashSales = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return get(`${API_BASE_URL}${query ? `?${query}` : ''}`)
}

export const getFlashSale = id => {
  return get(`${API_BASE_URL}/${id}`)
}

export const createFlashSale = data => {
  return post(API_BASE_URL, data)
}

export const updateFlashSale = (id, data) => {
  return patch(`${API_BASE_URL}/${id}`, data)
}

export const deleteFlashSale = id => {
  return del(`${API_BASE_URL}/delete/${id}`)
}

export const deleteManyFlashSales = ids => {
  return patch(`${API_BASE_URL}/delete-many`, { ids })
}

export const changeFlashSaleStatus = (id, status) => {
  return patch(`${API_BASE_URL}/status/${id}`, { status })
}

export const changeManyFlashSaleStatuses = (ids, status) => {
  return patch(`${API_BASE_URL}/status-many`, { ids, status })
}

export const changeManyFlashSalePositions = items => {
  return patch(`${API_BASE_URL}/positions-many`, { items })
}

export const updateFlashSaleById = updateFlashSale
