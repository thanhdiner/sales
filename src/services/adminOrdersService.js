import { get, patch } from '@/utils/request'

export const getAllOrders = async ({ page = 1, limit = 20, keyword = '', search = '', status = '' } = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  })

  const normalizedKeyword = String(keyword || search || '').trim()
  if (normalizedKeyword) {
    // Send both keys to support both old/new API contracts.
    params.set('keyword', normalizedKeyword)
    params.set('search', normalizedKeyword)
  }

  if (status) {
    params.set('status', status)
  }

  const query = params.toString()

  return await get(`admin/orders?${query}`)
}
export const getOrderDetailAdmin = id => get(`admin/orders/${id}`)
export const updateOrderStatus = (id, data) => patch(`admin/orders/${id}`, data)
export const deleteOrder = id => patch(`admin/orders/delete/${id}`)
