import { get, post } from '@/utils/clientRequest'

const API_DOMAIN = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1'

export const createOrder = data => post('orders', data)
export const getMyOrders = () => get('orders/my')
export const getOrderDetail = id => get(`orders/${id}`)
export const cancelOrder = id => post(`orders/cancel/${id}`)

// Public — Tra cứu đơn hàng không cần đăng nhập
export const trackOrder = async ({ orderCode, phone }) => {
  const res = await fetch(`${API_DOMAIN}/order-tracking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderCode, phone })
  })
  const json = await res.json()
  if (!res.ok) {
    const error = new Error(json?.error || 'Lỗi tra cứu đơn hàng')
    error.status = res.status
    throw error
  }
  return json
}
