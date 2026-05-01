import { post } from '@/utils/clientRequest'

export const createPendingOrder = data => {
  return post('orders/pending', data)
}

export const createVNPayPayment = orderId => {
  return post('payment/vnpay/create', { orderId })
}

export const createMoMoPayment = orderId => {
  return post('payment/momo/create', { orderId })
}

export const createZaloPayPayment = orderId => {
  return post('payment/zalopay/create', { orderId })
}

export const simulateSepayPayment = orderCode => {
  return post(`dev-payments/simulate-sepay/${orderCode}`)
}

export const redirectToPayment = async (method, orderId) => {
  let data

  if (method === 'vnpay') {
    data = await createVNPayPayment(orderId)
  } else if (method === 'momo') {
    data = await createMoMoPayment(orderId)
  } else if (method === 'zalopay') {
    data = await createZaloPayPayment(orderId)
  } else {
    throw new Error('Phương thức thanh toán không hợp lệ')
  }

  if (!data?.paymentUrl) {
    throw new Error('Không nhận được URL thanh toán')
  }

  window.location.href = data.paymentUrl
}