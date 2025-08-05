import { get, post, patch, del } from '@/utils/request'

const API_BASE_URL = 'admin/flash-sales'

export const getAdminFlashSales = params => {
  const query = new URLSearchParams(params).toString()
  return get(`${API_BASE_URL}${query ? '?' + query : ''}`)
}

export const getAdminFlashSaleById = id => get(`${API_BASE_URL}/${id}`)

export const createFlashSale = data => post(`${API_BASE_URL}/`, data)

export const updateFlashSaleById = (id, data) => patch(`${API_BASE_URL}/${id}`, data)

export const deleteFlashSale = id => del(`${API_BASE_URL}/delete/${id}`)

export const deleteManyFlashSales = ids => patch(`${API_BASE_URL}/delete-many`, { ids })

export const changeFlashSaleStatus = (id, status) => patch(`${API_BASE_URL}/status/${id}`, { status })

export const changeStatusManyFlashSales = (ids, status) => patch(`${API_BASE_URL}/status-many`, { ids, status })

export const changePositionManyFlashSales = items => patch(`${API_BASE_URL}/positions-many`, { items })
