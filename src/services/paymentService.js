import axiosInstance from './axiosInstance'

const BASE = '/payment'

/**
 * Tạo đơn hàng pending (trước khi redirect sang cổng thanh toán)
 * @returns {Promise<{orderId: string}>}
 */
export async function createPendingOrder(payload) {
  const res = await axiosInstance.post('/orders/pending', payload)
  return res.data
}

/**
 * Tạo VNPay payment URL
 * @param {string} orderId
 * @returns {Promise<{paymentUrl: string}>}
 */
export async function createVNPayPayment(orderId) {
  const res = await axiosInstance.post(`${BASE}/vnpay/create`, { orderId })
  return res.data
}

/**
 * Tạo MoMo payment URL
 * @param {string} orderId
 * @returns {Promise<{paymentUrl: string}>}
 */
export async function createMoMoPayment(orderId) {
  const res = await axiosInstance.post(`${BASE}/momo/create`, { orderId })
  return res.data
}

/**
 * Tạo ZaloPay payment URL
 * @param {string} orderId
 * @returns {Promise<{paymentUrl: string}>}
 */
export async function createZaloPayPayment(orderId) {
  const res = await axiosInstance.post(`${BASE}/zalopay/create`, { orderId })
  return res.data
}

/**
 * Redirect sang cổng thanh toán phù hợp
 * @param {'vnpay'|'momo'|'zalopay'} method
 * @param {string} orderId
 */
export async function redirectToPayment(method, orderId) {
  let data
  if (method === 'vnpay') data = await createVNPayPayment(orderId)
  else if (method === 'momo') data = await createMoMoPayment(orderId)
  else if (method === 'zalopay') data = await createZaloPayPayment(orderId)
  else throw new Error('Phương thức thanh toán không hợp lệ')

  if (!data.paymentUrl) throw new Error('Không nhận được URL thanh toán')
  window.location.href = data.paymentUrl
}
