import { post } from '@/utils/clientRequest'

/**
 * Tạo đơn hàng pending (trước khi redirect sang cổng thanh toán)
 * @returns {Promise<{orderId: string}>}
 */
export const createPendingOrder = data => post('orders/pending', data)

/**
 * Tạo VNPay payment URL
 * @param {string} orderId
 */
export const createVNPayPayment = orderId => post('payment/vnpay/create', { orderId })

/**
 * Tạo MoMo payment URL
 * @param {string} orderId
 */
export const createMoMoPayment = orderId => post('payment/momo/create', { orderId })

/**
 * Tạo ZaloPay payment URL
 * @param {string} orderId
 */
export const createZaloPayPayment = orderId => post('payment/zalopay/create', { orderId })

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

  if (!data?.paymentUrl) throw new Error('Không nhận được URL thanh toán')
  window.location.href = data.paymentUrl
}
