import React, { useCallback, useEffect, useState } from 'react'
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

const PHONE_REGEX = /(0[3|5|7|8|9])+([0-9]{8})\b/
const normalizeOrderCode = value => value.trim().replace(/^#/, '')
const normalizePhone = value => value.trim().replace(/[\s\-.]/g, '')

const getValidationError = ({ orderCode, phone }) => {
  if (!orderCode || !phone) {
    return 'Vui lòng nhập đầy đủ mã đơn hàng và số điện thoại.'
  }

  if (!PHONE_REGEX.test(phone)) {
    return 'Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.'
  }

  return ''
}

export default function OrderTrackingModal({
  isOpen,
  onClose,
  initialOrderCode = '',
  initialPhone = '',
  autoSearch = false,
}) {
  const [orderCode, setOrderCode] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const performSearch = useCallback(async ({ nextOrderCode, nextPhone }) => {
    const normalizedOrderCode = normalizeOrderCode(nextOrderCode)
    const normalizedPhone = normalizePhone(nextPhone)
    const validationError = getValidationError({ orderCode: normalizedOrderCode, phone: normalizedPhone })

    setOrderCode(normalizedOrderCode)
    setPhone(normalizedPhone)
    setError('')
    setResult(null)

    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const data = await trackOrder({ orderCode: normalizedOrderCode, phone: normalizedPhone })
      setResult(data.order)
    } catch (err) {
      setError(err.message || 'Không tìm thấy đơn hàng hoặc số điện thoại không khớp.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    await performSearch({ nextOrderCode: orderCode, nextPhone: phone })
  }

  useEffect(() => {
    if (!isOpen) return

    setOrderCode(initialOrderCode)
    setPhone(initialPhone)
    setResult(null)
    setError('')

    if (autoSearch && initialOrderCode && initialPhone) {
      void performSearch({ nextOrderCode: initialOrderCode, nextPhone: initialPhone })
    }
  }, [autoSearch, initialOrderCode, initialPhone, isOpen, performSearch])

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
              className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl pointer-events-auto dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <PackageSearch className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Kiểm tra đơn hàng</h2>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mã đơn hàng
                    </label>
                    <input
                      type="text"
                      value={orderCode}
                      onChange={(e) => setOrderCode(e.target.value)}
                      placeholder="Nhập mã đơn hàng..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Số điện thoại đặt hàng
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Nhập số điện thoại..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        Tra cứu đơn hàng
                      </>
                    )}
                  </button>
                </form>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                  >
                    <Info className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}

                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
                      <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                        #{result.id?.slice(-8).toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusCfg.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusCfg.label || result.status}
                      </span>
                    </div>

                    <div className="space-y-3 p-5">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Ngày đặt:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(result.createdAt).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
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
                      <div className="flex justify-between border-t border-gray-100 pt-3 text-sm dark:border-gray-700">
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
