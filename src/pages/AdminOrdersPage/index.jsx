import { useEffect, useState } from 'react'
import { Search, Eye, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react'
import { getAllOrders } from '@/services/adminOrdersService'
import { useNavigate } from 'react-router-dom'
import { Select } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import SEO from '@/components/SEO'

export default function AdminOrdersPage() {const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      const params = { page, limit, keyword, status }
      const res = await getAllOrders(params)
      if (res.success) {
        setOrders(res.orders)
        setTotal(res.total)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [page, keyword, status])

  const getStatusConfig = status => {
    const configs = {
      completed: {
        label: 'Hoàn thành',
        icon: CheckCircle,
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        iconColor: 'text-emerald-600'
      },
      confirmed: {
        label: 'Đã xác nhận',
        icon: CheckCircle,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600'
      },
      pending: {
        label: 'Chờ xác nhận',
        icon: Clock,
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-800',
        iconColor: 'text-amber-600'
      },
      shipping: {
        label: 'Đang giao',
        icon: Truck,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600'
      },
      cancelled: {
        label: 'Đã hủy',
        icon: XCircle,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        iconColor: 'text-gray-600'
      }
    }
    return configs[status] || configs.pending
  }

  const handleViewOrder = orderId => {
    navigate(`/admin/orders/${orderId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 dark:from-gray-800 dark:to-gray-800 rounded-xl">
      <SEO title="Admin – Đơn hàng" noIndex />
            <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý đơn hàng</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Theo dõi và quản lý tất cả đơn hàng của khách hàng</p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6 mb-8 dark:bg-gray-900 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-500"
                placeholder="Tìm kiếm theo tên, số điện thoại, mã đơn..."
                value={keyword}
                onChange={e => {
                  setKeyword(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <FilterOutlined className="text-lg text-slate-400" />
              <Select
                value={status}
                onChange={value => {
                  setStatus(value)
                  setPage(1)
                }}
                style={{ minWidth: 180 }}
                className="rounded-xl font-sans text-slate-700"
                placeholder="Tất cả trạng thái"
                options={[
                  { value: '', label: 'Tất cả trạng thái' },
                  { value: 'pending', label: 'Chờ xác nhận' },
                  { value: 'confirmed', label: 'Đã xác nhận' },
                  { value: 'shipping', label: 'Đang giao' },
                  { value: 'completed', label: 'Hoàn thành' },
                  { value: 'cancelled', label: 'Đã hủy' }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-white/20 overflow-hidden dark:bg-gray-900 dark:border-gray-700">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có đơn hàng nào</h3>
                <p className="text-gray-500">Chưa có đơn hàng nào phù hợp với bộ lọc hiện tại</p>
              </div>
            </div>
          ) : (
            <>
              {/* Table Header (hidden on mobile) */}
              <div className="hidden md:block bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 dark:from-gray-900 dark:to-gray-900 dark:border-gray-700">
                <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700 text-sm uppercase tracking-wide dark:text-gray-100">
                  <div className="col-span-2">Mã đơn</div>
                  <div className="col-span-2">Khách hàng</div>
                  <div className="col-span-2">Liên hệ</div>
                  <div className="col-span-2">Ngày tạo</div>
                  <div className="col-span-2">Trạng thái</div>
                  <div className="col-span-1">Tổng tiền</div>
                  <div className="col-span-1 text-center">Thao tác</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {orders.map(order => {
                  const statusConfig = getStatusConfig(order.status)
                  const StatusIcon = statusConfig.icon

                  return (
                    <div
                      key={order._id}
                      className="px-4 md:px-6 py-5 hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer group dark:bg-gray-800"
                      onClick={() => handleViewOrder(order._id)}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-4 md:items-center">
                        {/* Order ID */}
                        <div className="md:col-span-2 mb-3 md:mb-0">
                          <div className="md:hidden text-[11px] uppercase tracking-wide text-gray-500 font-semibold mb-1">Mã đơn</div>
                          <div className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg inline-block">
                            #{order._id.slice(-6).toUpperCase()}
                          </div>
                        </div>
                        {/* Customer */}
                        <div className="md:col-span-2 mb-3 md:mb-0">
                          <div className="md:hidden text-[11px] uppercase tracking-wide text-gray-500 font-semibold mb-1">Khách hàng</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {order.contact?.firstName} {order.contact?.lastName}
                          </div>
                        </div>
                        {/* Phone */}
                        <div className="md:col-span-2 mb-3 md:mb-0">
                          <div className="md:hidden text-[11px] uppercase tracking-wide text-gray-500 font-semibold mb-1">Liên hệ</div>
                          <div className="text-gray-600 font-medium dark:text-gray-400">{order.contact?.phone}</div>
                        </div>
                        {/* CreatedAt */}
                        <div className="md:col-span-2 mb-3 md:mb-0">
                          <div className="md:hidden text-[11px] uppercase tracking-wide text-gray-500 font-semibold mb-1">Ngày tạo</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(order.createdAt).toLocaleString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        {/* Status */}
                        <div className="md:col-span-2 mb-3 md:mb-0">
                          <div className="md:hidden text-[11px] uppercase tracking-wide text-gray-500 font-semibold mb-1">Trạng thái</div>
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                          >
                            <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                            {statusConfig.label}
                          </div>
                        </div>
                        {/* Total */}
                        <div className="md:col-span-1 mb-3 md:mb-0">
                          <div className="md:hidden text-[11px] uppercase tracking-wide text-gray-500 font-semibold mb-1">Tổng tiền</div>
                          <div className="font-bold text-blue-700 text-lg">{order.total?.toLocaleString('vi-VN')}₫</div>
                        </div>
                        {/* Action */}
                        <div className="md:col-span-1 text-left md:text-center">
                          <div className="md:hidden text-[11px] uppercase tracking-wide text-gray-500 font-semibold mb-1">Thao tác</div>
                          <button
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200 group-hover:scale-110 transform"
                            onClick={e => {
                              e.stopPropagation()
                              handleViewOrder(order._id)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {Math.min((page - 1) * limit + 1, total)} - {Math.min(page * limit, total)} của {total} đơn hàng
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Trước
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(total / limit)) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        page === pageNum ? 'bg-blue-600 text-white' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              <button
                disabled={page >= Math.ceil(total / limit)}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
