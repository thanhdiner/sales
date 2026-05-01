import { get, patch } from '@/utils/request'

export const getOrders = ({ page = 1, limit = 20, keyword = '', search = '', status = '' } = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  })

  const normalizedKeyword = String(keyword || search || '').trim()

  if (normalizedKeyword) {
    params.set('keyword', normalizedKeyword)
    params.set('search', normalizedKeyword)
  }

  if (status) {
    params.set('status', status)
  }

  return get(`admin/orders?${params.toString()}`)
}

export const getOrder = id => {
  return get(`admin/orders/${id}`)
}

export const getAllOrders = getOrders
export const getOrderDetail = getOrder

export const updateOrderStatus = (id, data) => {
  return patch(`admin/orders/${id}`, data)
}

export const deleteOrder = id => {
  return patch(`admin/orders/delete/${id}`)
}
