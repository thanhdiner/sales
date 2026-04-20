import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, PackageSearch, Search, Loader2, Info, CheckCircle2, Clock, Truck, XCircle, CircleDot } from 'lucide-react'
import { trackOrder } from '@/services/ordersService'

const STATUS_CONFIG = {
  pending: { label: 'Chờ xác nhận', color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10', icon: Clock },
  confirmed: { label: 'Đã xác nhận', color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10', icon: CheckCircle2 },
  shipping: { label: 'Đang giao hàng', color: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-500/10', icon: Truck },
  completed: { label: 'Hoàn thành', color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10', icon: CheckCircle2 },
  cancelled: { label: 'Đã hủy', color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10', icon: XCircle },
}

const PAYMENT_STATUS_CONFIG = {
  pending: { label: 'Chưa thanh toán', color: 'text-amber-600' },
  paid: { label: 'Đã thanh toán', color: 'text-emerald-600' },
  failed: { label: 'Thanh toán thất bại', color: 'text-red-600' },
}

export default function OrderTrackingModal({ isOpen, onClose }) {
  const [orderCode, setOrderCode] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    
    if (!orderCode.trim() || !phone.trim()) {
      setError('Vui lòng nhập đầy đủ mã đơn hàng và số điện thoại.')
      return
    }

    // Validate số điện thoại cơ bản (10 số, bắt đầu bằng số 0)
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/
    if (!phoneRegex.test(phone.trim())) {
      setError('Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.')
      return
    }

    setLoading(true)
    try {
      const data = await trackOrder({ orderCode: orderCode.trim(), phone: phone.trim() })
      setResult(data.order)
    } catch (err) {
      setError(err.message || 'Không tìm thấy đơn hàng hoặc số điện thoại không khớp.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOrderCode('')
    setPhone('')
    setResult(null)
    setError('')
    onClose()
  }

  const statusCfg = result ? STATUS_CONFIG[result.status] || {} : {}
  const paymentCfg = result ? PAYMENT_STATUS_CONFIG[result.paymentStatus] || {} : {}
  const StatusIcon = statusCfg.icon || CircleDot

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[1010] bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[1020] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-gray-100 dark:border-gray-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <PackageSearch className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Kiểm tra đơn hàng</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Mã đơn hàng
                    </label>
                    <input
                      type="text"
                      value={orderCode}
                      onChange={(e) => setOrderCode(e.target.value)}
                      placeholder="Nhập mã đơn hàng..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Số điện thoại đặt hàng
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Nhập số điện thoại..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Tra cứu đơn hàng
                      </>
                    )}
                  </button>
                </form>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 flex gap-3 text-red-600 dark:text-red-400"
                  >
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Result */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
                  >
                    {/* Order header */}
                    <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm font-mono">
                        #{result.id?.slice(-8).toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${statusCfg.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusCfg.label || result.status}
                      </span>
                    </div>

                    {/* Order details */}
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Ngày đặt:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(result.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Số sản phẩm:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{result.itemCount} sản phẩm</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Thanh toán:</span>
                        <span className={`font-medium ${paymentCfg.color}`}>
                          {paymentCfg.label || result.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-gray-100 dark:border-gray-700 pt-3">
                        <span className="text-gray-500 dark:text-gray-400">Tổng tiền:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {result.total?.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
