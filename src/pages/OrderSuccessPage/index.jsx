import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import SEO from '@/components/SEO'
import { getCart, removeManyCartItems } from '@/services/cartsService'
import { getOrderDetail } from '@/services/ordersService'
import { setCart } from '@/stores/cart'

const GATEWAY_NAMES = {
  vnpay: 'VNPay',
  momo: 'MoMo',
  zalopay: 'ZaloPay'
}

export default function OrderSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const search = new URLSearchParams(location.search)

  // Từ navigate state (thanh toán thủ công)
  const orderIdFromState = location.state?.orderId

  // Từ query params (cổng thanh toán redirect về)
  const status = search.get('status')           // 'failed' | null
  const reason = search.get('reason')
  const orderIdFromQuery = search.get('orderId')
  const method = search.get('method')           // 'vnpay' | 'momo' | 'zalopay'

  // VNPay redirect
  const vnpResponseCode = search.get('vnp_ResponseCode')
  // MoMo redirect
  const momoResultCode = search.get('resultCode')
  // ZaloPay redirect
  // ZaloPay redirect — uses the same `status` param already captured above

  const [pageState, setPageState] = useState('loading') // 'loading' | 'success' | 'failed'
  const [orderId, setOrderId] = useState(null)
  const [gatewayName, setGatewayName] = useState(null)

  useEffect(() => {
    sessionStorage.removeItem('checkoutOrdered')
    sessionStorage.removeItem('promoCode')
    sessionStorage.removeItem('appliedPromo')

    // Xóa cart sau khi thanh toán online thành công
    const clearCartItems = async (oid) => {
      try {
        const res = await getOrderDetail(oid)
        if (res?.order?.orderItems) {
          const productIds = res.order.orderItems.map(i => i.productId)
          await removeManyCartItems({ productIds })
          const newCart = await getCart()
          dispatch(setCart(newCart.items?.map(item => ({ ...item, id: item.productId })) || []))
        }
      } catch (e) {
        // silent — không block UI
        console.warn('[Cart] Could not clear cart after payment:', e.message)
      }
    }

    // Thanh toán thủ công (từ state)
    if (orderIdFromState) {
      setOrderId(orderIdFromState)
      setPageState('success')
      return
    }

    // VNPay redirect
    if (vnpResponseCode !== null) {
      setGatewayName('VNPay')
      setOrderId(orderIdFromQuery)
      const success = vnpResponseCode === '00'
      setPageState(success ? 'success' : 'failed')
      if (success && orderIdFromQuery) clearCartItems(orderIdFromQuery)
      return
    }

    // MoMo redirect (có query resultCode)
    if (momoResultCode !== null) {
      setGatewayName('MoMo')
      const oid = orderIdFromQuery || search.get('orderId')
      setOrderId(oid)
      const success = momoResultCode === '0'
      setPageState(success ? 'success' : 'failed')
      if (success && oid) clearCartItems(oid)
      return
    }

    // Generic redirect (ZaloPay / method param)
    if (method) {
      setGatewayName(GATEWAY_NAMES[method] || method)
      setOrderId(orderIdFromQuery)
      const success = status !== 'failed'
      setPageState(success ? 'success' : 'failed')
      if (success && orderIdFromQuery) clearCartItems(orderIdFromQuery)
      return
    }

    // Nếu có status=failed
    if (status === 'failed') {
      setPageState('failed')
      return
    }

    // Fallback
    setPageState('success')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-800 rounded-xl">
        <SEO title="Đang xử lý thanh toán" noIndex />
        <div className="text-center">
          <Loader2 className="mx-auto w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Đang xử lý kết quả thanh toán…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-800 rounded-xl">
      <SEO title={pageState === 'success' ? 'Đặt hàng thành công' : 'Thanh toán thất bại'} noIndex />
      <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg mx-auto dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">

        {pageState === 'success' ? (
          <>
            <CheckCircle className="mx-auto text-green-500 w-20 h-20 mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-3 dark:text-gray-100">
              {gatewayName ? `Thanh toán ${gatewayName} thành công!` : 'Đặt hàng thành công!'}
            </h2>
            {orderId && (
              <p className="text-gray-600 mb-2 dark:text-gray-300">
                Mã đơn hàng: <span className="font-bold text-blue-600">{String(orderId).slice(-8).toUpperCase()}</span>
              </p>
            )}
            <p className="text-gray-500 mb-8 dark:text-gray-400">
              {gatewayName
                ? `Thanh toán qua ${gatewayName} đã được xác nhận. Chúng tôi sẽ xử lý đơn hàng sớm nhất.`
                : 'Chúng tôi sẽ liên hệ và xử lý đơn hàng của bạn sớm nhất có thể.'}
            </p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto text-red-500 w-20 h-20 mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-3 dark:text-gray-100">Thanh toán thất bại</h2>
            <p className="text-gray-600 mb-2 dark:text-gray-300">
              {reason === 'invalid_signature' && 'Chữ ký không hợp lệ từ cổng thanh toán.'}
              {reason === 'payment_failed' && 'Giao dịch không thành công. Vui lòng thử lại.'}
              {reason === 'server_error' && 'Có lỗi phía máy chủ. Vui lòng liên hệ hỗ trợ.'}
              {!reason && 'Thanh toán không thành công hoặc đã bị hủy.'}
            </p>
            <p className="text-gray-500 mb-8 dark:text-gray-400">Đơn hàng của bạn chưa được xác nhận. Vui lòng thử lại hoặc chọn phương thức khác.</p>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-8 py-3 shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => navigate('/', { replace: true })}
          >
            Về trang chủ
          </button>
          {pageState === 'success' ? (
            <button
              className="border-2 border-blue-600 text-blue-600 font-semibold rounded-xl px-8 py-3 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-gray-700"
              onClick={() => navigate('/orders', { replace: true })}
            >
              Xem đơn hàng
            </button>
          ) : (
            <button
              className="border-2 border-red-600 text-red-600 font-semibold rounded-xl px-8 py-3 transition-all duration-300 hover:bg-red-50 dark:hover:bg-gray-700"
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
