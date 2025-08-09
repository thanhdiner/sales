import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOrderDetailAdmin, updateOrderStatus } from '@/services/adminOrdersService'
import { User, Phone, Mail, FileText, Package, CreditCard, Truck, CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react'
import { message as antdMessage, Select } from 'antd'
import titles from '@/utils/titles'

export default function AdminOrderDetailPage() {
  titles('Chi tiết đơn hàng')

  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [updating, setUpdating] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true)
      const res = await getOrderDetailAdmin(id)
      if (res.success) {
        setOrder(res.order)
        setStatus(res.order.status)
      }
      setLoading(false)
    }
    fetchOrder()
    // eslint-disable-next-line
  }, [id])

  const handleUpdateStatus = async () => {
    setUpdating(true)
    try {
      const res = await updateOrderStatus(id, { status })
      if (res.success) {
        setMsg('Cập nhật trạng thái thành công!')
        setOrder(prev => ({ ...prev, status }))
        antdMessage.success('Cập nhật trạng thái thành công!')
        setTimeout(() => setMsg(''), 2500)
      }
    } finally {
      setUpdating(false)
    }
  }

  const getStatusInfo = status => {
    const statusMap = {
      pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800', icon: Truck },
      completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle }
    }
    return statusMap[status] || statusMap.pending
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-800 rounded-xl">
        <div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-600 font-medium text-lg text-center">Đang tải đơn hàng...</p>
        </div>
      </div>
    )

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-xl">Không tìm thấy đơn hàng!</p>
        </div>
      </div>
    )

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-gray-800 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors duration-200 mb-4 dark:text-gray-100"
            onClick={() => navigate('/admin/orders')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách đơn hàng
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Đơn hàng #{order._id.slice(-6).toUpperCase()}</h1>
              <div className="flex items-center gap-3">
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
                  <StatusIcon className="h-4 w-4 mr-1.5" />
                  {statusInfo.label}
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 dark:bg-gray-800 dark:outline dark:outline-2 dark:outline-gray-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Select
                  value={status}
                  onChange={value => setStatus(value)}
                  style={{ minWidth: 180, fontFamily: 'inherit' }}
                  className="font-sans text-slate-700"
                  options={[
                    { value: 'pending', label: 'Chờ xác nhận' },
                    { value: 'confirmed', label: 'Đã xác nhận' },
                    { value: 'shipping', label: 'Đang giao' },
                    { value: 'completed', label: 'Hoàn thành' },
                    { value: 'cancelled', label: 'Đã hủy' }
                  ]}
                />
                <button
                  disabled={updating || status === order.status}
                  onClick={handleUpdateStatus}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang lưu...
                    </>
                  ) : (
                    'Cập nhật'
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* Success Message */}
          {msg && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">{msg}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Info & Items */}
          <div className="lg:col-span-2 space-y-6 ">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 dark:bg-gray-800 dark:outline dark:outline-2 dark:outline-gray-700">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center dark:text-gray-100">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Thông tin khách hàng
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800 dark:text-gray-100">
                      {order.contact.firstName} {order.contact.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-slate-600 dark:text-gray-400">{order.contact.phone}</p>
                  </div>
                </div>
                {order.contact.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-600">{order.contact.email}</p>
                    </div>
                  </div>
                )}
                {order.contact.notes && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-600">{order.contact.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 dark:bg-gray-800 dark:outline dark:outline-2 dark:outline-gray-700">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center dark:text-gray-100">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Sản phẩm đã đặt
              </h2>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={item.productId} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg dark:bg-gray-800 dark:outline dark:outline-2 dark:outline-gray-700 hover:!bg-blue-50 dark:hover:!bg-gray-700 cursor-pointer">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800 dark:text-gray-100">{item.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-gray-100">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-800 dark:text-gray-200">x{item.quantity}</p>
                      <p className="text-sm text-blue-600 font-semibold">{item.price?.toLocaleString('vi-VN')}₫</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Payment Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 dark:bg-gray-800 dark:outline dark:outline-2 dark:outline-gray-700">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 dark:text-gray-100">Tổng quan đơn hàng</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-slate-600 dark:text-gray-400">
                  <span>Tạm tính:</span>
                  <span>{order.subtotal?.toLocaleString('vi-VN')}₫</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{order.discount?.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-gray-400">
                  <span>Phí vận chuyển:</span>
                  <span>{order.shipping === 0 ? 'Miễn phí' : `${order.shipping?.toLocaleString('vi-VN')}₫`}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-slate-800">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{order.total?.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Payment Info */}
            {order.transferInfo?.bank && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Thông tin chuyển khoản
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Ngân hàng</p>
                    <p className="font-medium text-slate-800">{order.transferInfo.bank}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Số tài khoản</p>
                    <p className="font-mono font-medium text-slate-800">{order.transferInfo.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Chủ tài khoản</p>
                    <p className="font-medium text-slate-800">{order.transferInfo.accountName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Nội dung chuyển khoản</p>
                    <p className="font-mono font-medium text-blue-600 bg-white px-3 py-2 rounded-lg">{order.transferInfo.content}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
