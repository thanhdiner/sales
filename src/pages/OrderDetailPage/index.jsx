import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { cancelOrder, getOrderDetail } from '@/services/ordersService'
import { ArrowLeft, Package, User, Phone, Mail, FileText, CheckCircle, Clock, XCircle, Truck } from 'lucide-react'
import { message, Modal } from 'antd'
import SEO from '@/components/SEO'

export default function OrderDetailPage() {const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true)
      try {
        const res = await getOrderDetail(id)
        if (res && res.success) setOrder(res.order)
        else navigate('/orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
    // eslint-disable-next-line
  }, [id])

  const getStatusConfig = status => {
    const configs = {
      completed: {
        icon: CheckCircle,
        text: 'Hoàn thành',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200'
      },
      confirmed: {
        icon: CheckCircle,
        text: 'Đã xác nhận',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      },
      shipping: {
        icon: Truck,
        text: 'Đang giao hàng',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      },
      pending: {
        icon: Clock,
        text: 'Chờ xác nhận',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200'
      },
      cancelled: {
        icon: XCircle,
        text: 'Đã hủy',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      }
    }
    return configs[status] || configs.pending
  }

  const handleCancelOrder = () => {
    Modal.confirm({
      title: <span className="text-gray-800 dark:text-gray-100">Xác nhận hủy đơn hàng</span>,
      content: <span className="text-gray-600 dark:text-gray-300">Bạn có chắc muốn hủy đơn hàng này không?</span>,
      okText: 'Hủy đơn',
      cancelText: 'Không',
      okButtonProps: { danger: true, loading: cancelling },
      onOk: async () => {
        setCancelling(true)
        try {
          const res = await cancelOrder(order._id)
          if (res.success) {
            message.success('Đã hủy đơn hàng thành công!')
            setOrder(res.order)
          } else {
            message.error(res.error || 'Không thể hủy đơn hàng!')
          }
        } catch (err) {
          message.error('Có lỗi xảy ra, vui lòng thử lại!')
        }
        setCancelling(false)
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center dark:from-gray-800 dark:to-gray-800 rounded-xl">
      <SEO title="Chi tiết đơn hàng" noIndex />
              <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium dark:text-gray-300">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (!order) return null

  const statusConfig = getStatusConfig(order.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-800 rounded-xl">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            className="group inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-6"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Quay lại danh sách đơn hàng</span>
          </button>

          <div className="bg-white/80 rounded-2xl p-6 shadow-lg border border-white/20 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">Đơn hàng #{order._id}</h1>
                <p className="text-gray-600 dark:text-gray-300">Chi tiết thông tin đơn hàng của bạn</p>
              </div>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.bgColor} ${statusConfig.borderColor}`}
              >
                <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                <span className={`font-semibold ${statusConfig.color}`}>{statusConfig.text}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg border border-white/20 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Thông tin nhận hàng</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {order.contact.firstName} {order.contact.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{order.contact.phone}</span>
                </div>
                {order.contact.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{order.contact.email}</span>
                  </div>
                )}
                {order.contact.notes && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{order.contact.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg border border-white/20 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Danh sách sản phẩm</h2>
              </div>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={item.productId} className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50/50 transition-colors">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
                      />
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate dark:text-gray-100">{item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-blue-600 dark:text-gray-100">{item.price?.toLocaleString('vi-VN')}₫</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">x{item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg border border-white/20 sticky top-8 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
              <h2 className="text-xl font-bold text-gray-900 mb-6 dark:text-gray-100">Tóm tắt đơn hàng</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Tạm tính:</span>
                  <span className="font-medium dark:text-gray-100">{order.subtotal?.toLocaleString('vi-VN')}₫</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600">
                    <span className="font-medium dark:text-gray-100">Giảm giá:</span>
                    <span className="font-medium dark:text-gray-100">-{order.discount?.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Phí vận chuyển:</span>
                  <span className="font-medium dark:text-gray-100">
                    {order.shipping === 0 ? (
                      <span className="text-emerald-600 font-semibold dark:text-gray-100">Miễn phí</span>
                    ) : (
                      <span className="dark:text-gray-100">{order.shipping?.toLocaleString('vi-VN')}₫</span>
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Tổng cộng:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:text-gray-100">
                      {order.total?.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
                  Theo dõi đơn hàng
                </button>
                <button className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Liên hệ hỗ trợ
                </button>
                {order.status === 'pending' && (
                  <button
                    className="w-full border border-red-300 text-red-700 font-semibold py-3 px-4 rounded-xl hover:bg-red-50 transition-colors dark:border-red-600 dark:text-red-300 dark:hover:bg-red-700"
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                  >
                    {cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
