import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { useEffect } from 'react'
import SEO from '@/components/SEO'

export default function OrderSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const orderId = location.state?.orderId

  useEffect(() => {sessionStorage.removeItem('checkoutOrdered')
    sessionStorage.removeItem('promoCode')
    sessionStorage.removeItem('appliedPromo')
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-800 rounded-xl">
      <SEO title="Đặt hàng thành công" noIndex />
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg mx-auto dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
        <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-3 dark:text-gray-100">Đặt hàng thành công!</h2>
        <p className="text-gray-600 mb-4 dark:text-gray-300">
          {orderId ? (
            <>
              Mã đơn hàng của bạn: <span className="font-bold text-blue-600">{orderId}</span>
            </>
          ) : (
            <>Cảm ơn bạn đã đặt hàng.</>
          )}
        </p>
        <p className="text-gray-500 mb-8">Chúng tôi sẽ liên hệ và xử lý đơn hàng của bạn sớm nhất có thể.</p>
        <button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-8 py-3 shadow-lg transition-all duration-300 hover:scale-105"
          onClick={() => navigate('/', { replace: true })}
        >
          Về trang chủ
        </button>
        <button
          className="ml-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl px-8 py-3 transition-all duration-300 hover:bg-blue-50"
          onClick={() => navigate('/orders', { replace: true })}
        >
          Xem đơn hàng của tôi
        </button>
      </div>
    </div>
  )
}
