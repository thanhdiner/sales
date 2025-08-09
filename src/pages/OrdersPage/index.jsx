import { useEffect, useState } from 'react'
import { getMyOrders } from '@/services/ordersService'
import { useNavigate } from 'react-router-dom'
import { Package, ShoppingBag, Clock, CheckCircle, XCircle, Calendar, CreditCard, Truck } from 'lucide-react'
import titles from '@/utils/titles'

export default function OrdersPage() {
  titles('Đơn hàng của tôi')

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      try {
        const res = await getMyOrders()
        if (res.success) setOrders(res.orders)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const getStatusIcon = status => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />
      case 'shipping':
        return <Truck className="w-5 h-5 text-blue-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Package className="w-5 h-5 text-gray-500" />
    }
  }
  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'shipping':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  const getStatusText = status => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành'
      case 'confirmed':
        return 'Đã xác nhận'
      case 'pending':
        return 'Chờ xác nhận'
      case 'shipping':
        return 'Đang giao'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="dark:from-gray-800 dark:to-gray-800 rounded-xl min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <p className="text-center text-slate-600 mt-6 text-lg font-medium dark:text-gray-300">Đang tải đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="dark:from-gray-800 dark:to-gray-800 rounded-xl min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="dark:bg-gray-800 dark:border-gray-600 dark:border-2 dark:border-solid bg-white rounded-3xl p-12 shadow-xl border border-slate-200">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 dark:text-gray-300">Chưa có đơn hàng nào</h2>
              <p className="text-slate-600 mb-8 dark:text-gray-400">
                Hãy khám phá các sản phẩm tuyệt vời và tạo đơn hàng đầu tiên của bạn!
              </p>
              <button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => navigate('/')}
              >
                <ShoppingBag className="w-5 h-5 inline mr-2" />
                Mua sắm ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-xl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 dark:text-gray-100">Đơn hàng của tôi</h1>
          <p className="text-slate-600 dark:text-gray-300">Quản lý và theo dõi tất cả đơn hàng của bạn</p>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-6">
          {orders.map(order => (
            <div
              key={order._id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-blue-200 p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid"
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-slate-800 dark:text-gray-100">#{order._id}</div>
                      <div className="text-slate-500 text-sm font-medium dark:text-gray-400">
                        {(order.orderItems?.length || order.items) + ' sản phẩm'}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(order.createdAt).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm font-bold text-slate-800 dark:text-gray-100">{order.total?.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>
                {/* Status */}
                <div className="flex items-center justify-between lg:justify-end gap-4">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold text-sm ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </div>
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <svg
                      className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-6 mb-6 mt-12">
          {/* Hàng 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border flex flex-col items-center dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-2">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-gray-100">
              {orders.filter(o => o.status === 'completed').length}
            </div>
            <div className="text-slate-600 text-sm text-center dark:text-gray-400">Hoàn thành</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border flex flex-col items-center dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
              <CheckCircle className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-gray-100">
              {orders.filter(o => o.status === 'confirmed').length}
            </div>
            <div className="text-slate-600 text-sm text-center dark:text-gray-400">Đã xác nhận</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border flex flex-col items-center dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
              <Truck className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-gray-100">{orders.filter(o => o.status === 'shipping').length}</div>
            <div className="text-slate-600 text-sm text-center dark:text-gray-400">Đang giao</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {/* Hàng 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border flex flex-col items-center dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-2">
              <Clock className="w-7 h-7 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-gray-100">{orders.filter(o => o.status === 'pending').length}</div>
            <div className="text-slate-600 text-sm text-center dark:text-gray-400">Chờ xác nhận</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border flex flex-col items-center dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-2">
              <XCircle className="w-7 h-7 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-gray-100">
              {orders.filter(o => o.status === 'cancelled').length}
            </div>
            <div className="text-slate-600 text-sm text-center dark:text-gray-400">Đã hủy</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border flex flex-col items-center dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
              <Package className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-gray-100">{orders.length}</div>
            <div className="text-slate-600 text-sm text-center dark:text-gray-400">Tổng đơn hàng</div>
          </div>
        </div>
      </div>
    </div>
  )
}
