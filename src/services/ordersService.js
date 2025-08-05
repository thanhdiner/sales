import { get, post } from '@/utils/clientRequest'

export const createOrder = data => post('orders', data)
export const getMyOrders = () => get('orders/my')
export const getOrderDetail = id => get(`orders/${id}`)
export const cancelOrder = id => post(`orders/cancel/${id}`)
