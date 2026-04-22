import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOrderDetailAdmin, updateOrderStatus } from '@/services/adminOrdersService'
import { User, Phone, Mail, FileText, Package, CreditCard, Truck, CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react'
import { message as antdMessage, Select } from 'antd'
import SEO from '@/components/SEO'

export default function AdminOrderDetailPage() {
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
      pending: {
        label: 'Chờ xác nhận',
        color: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900/60 dark:bg-yellow-900/20 dark:text-yellow-300',
        icon: Clock
      },
      confirmed: {
        label: 'Đã xác nhận',
        color: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-300',
        icon: CheckCircle
      },
      shipping: {
        label: 'Đang giao',
        color:
          'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/60 dark:bg-purple-900/20 dark:text-purple-300',
        icon: Truck
      },
      completed: {
        label: 'Hoàn thành',
        color: 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-300',
        icon: CheckCircle
      },
      cancelled: {
        label: 'Đã hủy',
        color: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300',
        icon: XCircle
      }
    }

    return statusMap[status] || statusMap.pending
  }

  const getOrderItemThumbnail = item => {
    return (
      item.image ||
      item.thumbnail ||
      item.product?.image ||
      item.product?.thumbnail ||
      item.productId?.image ||
      item.productId?.thumbnail ||
      ''
    )
  }

  const getOrderItemKey = item => {
    return item.productId?._id || item.product?._id || item.productId || item._id || item.name
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-xl bg-slate-50 dark:bg-gray-900">
        <SEO title="Admin – Chi tiết đơn" noIndex />

        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-white" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Đang tải đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-xl bg-slate-50 dark:bg-gray-900">
        <SEO title="Admin – Chi tiết đơn" noIndex />

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 dark:border-red-900/60 dark:bg-red-900/20">
            <XCircle className="h-6 w-6" />
          </div>

          <p className="text-base font-semibold text-gray-900 dark:text-white">Không tìm thấy đơn hàng</p>

          <button
            type="button"
            onClick={() => navigate('/admin/orders')}
            className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-gray-900">
      <SEO title="Admin – Chi tiết đơn" noIndex />

      <div className="mx-auto max-w-6xl">
        <div className="mb-5">
          <button
            type="button"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            onClick={() => navigate('/admin/orders')}
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách đơn hàng
          </button>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Đơn hàng #{order._id.slice(-6).toUpperCase()}
              </h1>

              <div
                className={`mt-3 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${statusInfo.color}`}
              >
                <StatusIcon className="h-4 w-4" />
                {statusInfo.label}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select
                  value={status}
                  onChange={value => setStatus(value)}
                  style={{ minWidth: 180, fontFamily: 'inherit' }}
                  className="font-sans text-gray-700"
                  options={[
                    { value: 'pending', label: 'Chờ xác nhận' },
                    { value: 'confirmed', label: 'Đã xác nhận' },
                    { value: 'shipping', label: 'Đang giao' },
                    { value: 'completed', label: 'Hoàn thành' },
                    { value: 'cancelled', label: 'Đã hủy' }
                  ]}
                />

                <button
                  type="button"
                  disabled={updating || status === order.status}
                  onClick={handleUpdateStatus}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                  {updating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-gray-300 dark:border-t-gray-900" />
                      Đang lưu...
                    </>
                  ) : (
                    'Cập nhật'
                  )}
                </button>
              </div>
            </div>
          </div>

          {msg && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/60 dark:bg-green-900/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">{msg}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                Thông tin khách hàng
              </h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-5 w-5 text-gray-400" />
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.contact.firstName} {order.contact.lastName}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">{order.contact.phone}</p>
                </div>

                {order.contact.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">{order.contact.email}</p>
                  </div>
                )}

                {order.contact.notes && (
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">{order.contact.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                Sản phẩm đã đặt
              </h2>

              <div className="space-y-3">
                {order.orderItems.map(item => {
                  const thumbnail = getOrderItemThumbnail(item)

                  return (
                    <div
                      key={getOrderItemKey(item)}
                      className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                          {thumbnail ? (
                            <img src={thumbnail} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-6 w-6 text-gray-400" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">{item.name}</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200">x{item.quantity}</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                          {item.price?.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Tổng quan đơn hàng</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Tạm tính</span>
                  <span>{order.subtotal?.toLocaleString('vi-VN')}₫</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-300">
                    <span>Giảm giá</span>
                    <span>-{order.discount?.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Phí vận chuyển</span>
                  <span>{order.shipping === 0 ? 'Miễn phí' : `${order.shipping?.toLocaleString('vi-VN')}₫`}</span>
                </div>

                <div className="border-t border-gray-100 pt-3 dark:border-gray-700">
                  <div className="flex justify-between text-base font-semibold text-gray-900 dark:text-white">
                    <span>Tổng cộng</span>
                    <span>{order.total?.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>
            </div>

            {order.transferInfo?.bank && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                  <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Thông tin chuyển khoản
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Ngân hàng</p>
                    <p className="font-medium text-gray-900 dark:text-white">{order.transferInfo.bank}</p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Số tài khoản</p>
                    <p className="font-mono font-medium text-gray-900 dark:text-white">{order.transferInfo.accountNumber}</p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Chủ tài khoản</p>
                    <p className="font-medium text-gray-900 dark:text-white">{order.transferInfo.accountName}</p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Nội dung chuyển khoản</p>
                    <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm font-medium text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      {order.transferInfo.content}
                    </p>
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