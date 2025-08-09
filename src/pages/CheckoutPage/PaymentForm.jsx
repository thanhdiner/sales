import { useEffect, useMemo, useState } from 'react'
import { Table, Button, Modal, Form, Input, Space, Typography, Tag, Popconfirm, message, Switch, Card } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, BankOutlined, Copy, CheckCheck, Download } from '@ant-design/icons' // nếu dùng lucide-react thì import Copy/CheckCheck từ đó
import { Lock } from 'lucide-react'
import { getActiveBankInfo } from '@/services/bankInfo.service'

const { Title, Text } = Typography

export function PaymentForm({ paymentMethod, setPaymentMethod, paymentMethods, formData, handleInputChange }) {
  const [bankInfo, setBankInfo] = useState(null)
  const [loadingBank, setLoadingBank] = useState(false)
  const [copied, setCopied] = useState({ acc: false, note: false })

  useEffect(() => {
    if (paymentMethod !== 'transfer') return
    ;(async () => {
      setLoadingBank(true)
      try {
        const res = await getActiveBankInfo()
        setBankInfo(res?.bankInfo || res?.data || null)
      } catch (e) {
        message.error(e?.message || 'Không lấy được thông tin ngân hàng')
      } finally {
        setLoadingBank(false)
      }
    })()
  }, [paymentMethod])

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(prev => ({ ...prev, [key]: true }))
      setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 1200)
      message.success('Đã copy')
    } catch {
      message.error('Copy thất bại')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-gray-100">Phương thức thanh toán</h2>

      <div className="space-y-3">
        {paymentMethods.map(method => (
          <label
            key={method.id}
            className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            } dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid`}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={e => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-blue-600 mt-1"
            />
            <div className="text-blue-600 mt-1">{method.icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 dark:text-gray-100">{method.name}</div>
              <div className="text-sm text-gray-500 mt-1 dark:text-gray-400">{method.description}</div>
            </div>
          </label>
        ))}
      </div>

      {paymentMethod === 'transfer' && (
        <div className="mt-6 space-y-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl dark:from-gray-800 dark:to-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
          <h3 className="font-semibold text-green-800 dark:text-gray-100">💳 Thông tin chuyển khoản</h3>

          {loadingBank ? (
            <div className="text-green-700 dark:text-gray-300">Đang tải…</div>
          ) : bankInfo ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="text-green-700 space-y-2 dark:text-gray-300">
                  <p>
                    <strong>Ngân hàng:</strong> {bankInfo.bankName}
                  </p>
                  <p className="flex items-center gap-2">
                    <strong>Số tài khoản:</strong> {bankInfo.accountNumber}
                    <button
                      type="button"
                      onClick={() => copy(bankInfo.accountNumber, 'acc')}
                      className="px-2 py-1 text-xs rounded-md border border-green-300 hover:bg-green-100"
                    >
                      {copied.acc ? 'Đã copy' : 'Copy'}
                    </button>
                  </p>
                  <p>
                    <strong>Chủ tài khoản:</strong> {bankInfo.accountHolder}
                  </p>
                  <p className="flex items-center gap-2">
                    <strong>Nội dung:</strong> {bankInfo.noteTemplate}
                  </p>
                </div>

                {bankInfo.qrCode && (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={bankInfo.qrCode}
                      alt="QR chuyển khoản"
                      className="w-44 h-44 rounded-lg border border-green-200 object-cover"
                      loading="lazy"
                    />
                    <a href={bankInfo.qrCode} target="_blank" rel="noreferrer" className="text-sm underline text-green-700">
                      Mở ảnh QR
                    </a>
                  </div>
                )}
              </div>

              <div className="text-sm text-green-700 bg-green-100 p-3 rounded-lg">
                Chuyển khoản xong bạn cứ ấn tiếp tục, chúng tôi sẽ tự động liên hệ bạn qua số điện thoại đã đăng ký để xác nhận thanh toán,
                hoặc bạn chủ động ib cho Shop nhé.
              </div>
            </>
          ) : (
            <div className="text-green-700 dark:text-gray-300">Chưa có thông tin chuyển khoản.</div>
          )}
        </div>
      )}
      {paymentMethod === 'card' && (
        <div className="mt-6 space-y-4 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-800">Thông tin thẻ</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số thẻ</label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={e => handleInputChange('cardNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên trên thẻ</label>
              <input
                type="text"
                value={formData.cardName}
                onChange={e => handleInputChange('cardName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="NGUYEN VAN A"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hết hạn</label>
                <input
                  type="text"
                  value={formData.expiryDate}
                  onChange={e => handleInputChange('expiryDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input
                  type="text"
                  value={formData.cvv}
                  onChange={e => handleInputChange('cvv', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
        <Lock className="w-5 h-5 text-green-600 dark:text-gray-300" />
        <span className="text-green-800 font-medium dark:text-gray-100">Thanh toán được bảo mật bằng SSL 256-bit</span>
      </div>
    </div>
  )
}
