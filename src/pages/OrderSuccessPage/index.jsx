import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import SEO from '@/components/SEO'
import { syncCartFromServer } from '@/lib/clientCache'
import { removeManyCartItems } from '@/services/cartsService'
import { getOrderDetail } from '@/services/ordersService'

const GATEWAY_NAMES = {
  vnpay: 'VNPay',
  momo: 'MoMo',
  zalopay: 'ZaloPay',
  sepay: 'Sepay',
}

export default function OrderSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const search = new URLSearchParams(location.search)

  const orderIdFromState = location.state?.orderId

  const status = search.get('status')
  const reason = search.get('reason')
  const orderIdFromQuery = search.get('orderId')
  const method = search.get('method')

  const vnpResponseCode = search.get('vnp_ResponseCode')
  const momoResultCode = search.get('resultCode')

  const [pageState, setPageState] = useState('loading')
  const [orderId, setOrderId] = useState(null)
  const [gatewayName, setGatewayName] = useState(null)

  useEffect(() => {
    sessionStorage.removeItem('checkoutOrdered')
    sessionStorage.removeItem('promoCode')
    sessionStorage.removeItem('appliedPromo')

    const clearCartItems = async oid => {
      try {
        const res = await getOrderDetail(oid)

        if (res?.order?.orderItems) {
          const productIds = res.order.orderItems.map(item => item.productId)
          await removeManyCartItems({ productIds })
          await syncCartFromServer(dispatch)
        }
      } catch (e) {
        console.warn('[Cart] Could not clear cart after payment:', e.message)
      }
    }

    if (orderIdFromState) {
      setOrderId(orderIdFromState)
      setPageState('success')
      return
    }

    if (vnpResponseCode !== null) {
      setGatewayName('VNPay')
      setOrderId(orderIdFromQuery)

      const success = vnpResponseCode === '00'
      setPageState(success ? 'success' : 'failed')

      if (success && orderIdFromQuery) clearCartItems(orderIdFromQuery)
      return
    }

    if (momoResultCode !== null) {
      setGatewayName('MoMo')

      const oid = orderIdFromQuery || search.get('orderId')
      setOrderId(oid)

      const success = momoResultCode === '0'
      setPageState(success ? 'success' : 'failed')

      if (success && oid) clearCartItems(oid)
      return
    }

    if (method) {
      setGatewayName(GATEWAY_NAMES[method] || method)
      setOrderId(orderIdFromQuery)

      const success = status !== 'failed'
      setPageState(success ? 'success' : 'failed')

      if (success && orderIdFromQuery) clearCartItems(orderIdFromQuery)
      return
    }

    if (status === 'failed') {
      setPageState('failed')
      return
    }

    setPageState('success')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getFailureMessage = () => {
    if (reason === 'invalid_signature') return 'Chữ ký không hợp lệ từ cổng thanh toán.'
    if (reason === 'payment_failed') return 'Giao dịch không thành công. Vui lòng thử lại.'
    if (reason === 'order_expired') return 'Đơn hàng đã hết hạn thanh toán. Tồn kho đã được trả lại.'
    if (reason === 'server_error') return 'Có lỗi phía máy chủ. Vui lòng liên hệ hỗ trợ.'

    return 'Thanh toán không thành công hoặc đã bị hủy.'
  }

  if (pageState === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 dark:bg-gray-900">
        <SEO title="Đang xử lý thanh toán" noIndex />

        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100" />
          <p className="mt-5 text-sm font-medium text-gray-600 dark:text-gray-300">
            Đang xử lý kết quả thanh toán...
          </p>
        </div>
      </div>
    )
  }

  const isSuccess = pageState === 'success'

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 dark:bg-gray-900">
      <SEO title={isSuccess ? 'Đặt hàng thành công' : 'Thanh toán thất bại'} noIndex />

      <div className="mx-auto w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
          {isSuccess ? 'Hoàn tất' : 'Chưa hoàn tất'}
        </p>

        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
          {isSuccess
            ? gatewayName
              ? `Thanh toán ${gatewayName} thành công`
              : 'Đặt hàng thành công'
            : 'Thanh toán thất bại'}
        </h1>

        {isSuccess ? (
          <>
            {orderId && (
              <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  Mã đơn hàng
                </p>
                <p className="mb-0 text-base font-semibold text-gray-900 dark:text-gray-100">
                  {String(orderId).slice(-8).toUpperCase()}
                </p>
              </div>
            )}

            <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-300">
              {gatewayName
                ? `Thanh toán qua ${gatewayName} đã được xác nhận. Chúng tôi sẽ xử lý đơn hàng sớm nhất.`
                : 'Chúng tôi sẽ liên hệ và xử lý đơn hàng của bạn sớm nhất có thể.'}
            </p>
          </>
        ) : (
          <>
            <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-300">
              {getFailureMessage()}
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
              Đơn hàng của bạn chưa được xác nhận. Vui lòng thử lại hoặc chọn phương thức khác.
            </p>
          </>
        )}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
            onClick={() => navigate('/', { replace: true })}
          >
            Về trang chủ
          </button>

          {isSuccess ? (
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
              onClick={() => navigate('/orders', { replace: true })}
            >
              Xem đơn hàng
            </button>
          ) : (
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
              onClick={() => navigate('/cart', { replace: true })}
            >
              Quay lại giỏ hàng
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
