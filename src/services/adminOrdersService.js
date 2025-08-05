import { get, patch } from '@/utils/request'

export const getAllOrders = params => get('admin/orders', params)
export const getOrderDetailAdmin = id => get(`admin/orders/${id}`)
export const updateOrderStatus = (id, data) => patch(`admin/orders/${id}`, data)
export const deleteOrder = id => patch(`admin/orders/delete/${id}`)
