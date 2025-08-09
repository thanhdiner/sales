import { get, patch } from '@/utils/request'

export const getAllOrders = async ({ page = 1, limit = 20, ...rest}) => {
  const query = new URLSearchParams({
    page,
    limit,
    ...rest
  }).toString()

  return await get(`admin/orders?${query}`)
}
export const getOrderDetailAdmin = id => get(`admin/orders/${id}`)
export const updateOrderStatus = (id, data) => patch(`admin/orders/${id}`, data)
export const deleteOrder = id => patch(`admin/orders/delete/${id}`)
