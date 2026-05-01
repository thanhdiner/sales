import { get, post } from '@/utils/clientRequest'
import { API_URL } from '@/utils/env'

const API_DOMAIN = API_URL

export const createOrder = data => {
  return post('orders', data)
}

export const getMyOrders = () => {
  return get('orders/my')
}

export const getOrder = id => {
  return get(`orders/${id}`)
}

export const getOrderDetail = getOrder

export const cancelOrder = id => {
  return post(`orders/cancel/${id}`)
}

export const trackOrder = async ({ orderCode, phone }) => {
  const res = await fetch(`${API_DOMAIN}/order-tracking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderCode, phone }),
  })

  const json = await res.json()

  if (!res.ok) {
    const error = new Error(json?.error || 'Lỗi tra cứu đơn hàng')
    error.status = res.status
    throw error
  }

  return json
}