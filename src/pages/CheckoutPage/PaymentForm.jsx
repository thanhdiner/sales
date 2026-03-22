import { useEffect, useState } from 'react'
import { message } from 'antd'
import { Lock, ExternalLink } from 'lucide-react'
import { getActiveBankInfo } from '@/services/bankInfo.service'

const ONLINE_METHODS = ['vnpay', 'momo', 'zalopay']

const GATEWAY_INFO = {
  vnpay: {
    name: 'VNPay',
    logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png',
    desc: 'Bạn sẽ được chuyển sang cổng thanh toán VNPay sau khi xác nhận đơn hàng.',
    supports: ['ATM nội địa', 'Visa / Mastercard', 'Quét mã QR VNPay']
  },
  momo: {
    name: 'Ví MoMo',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png',
    desc: 'Bạn sẽ được chuyển sang ứng dụng MoMo để xác nhận thanh toán.',
    supports: ['Ví MoMo', 'Quét mã QR MoMo', 'ATM liên kết MoMo']
  },
  zalopay: {
    name: 'ZaloPay',
    logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png',
    desc: 'Bạn sẽ được chuyển sang ứng dụng ZaloPay để hoàn tất thanh toán.',
    supports: ['Ví ZaloPay', 'Quét mã QR ZaloPay', 'ATM liên kết ZaloPay']
  }
}

export function PaymentForm({ paymentMethod, setPaymentMethod, paymentMethods }) {
  const [bankInfo, setBankInfo] = useState(null)
  const [loadingBank, setLoadingBank] = useState(false)
  const [copied, setCopied] = useState({ acc: false })

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

  const gateway = GATEWAY_INFO[paymentMethod]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-gray-100">Phương thức thanh toán</h2>

      <div className="space-y-3">
        {paymentMethods.map(method => (
          <label
            key={method.id}
            className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              paymentMethod === method.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
            } dark:bg-gray-800`}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={e => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-blue-600 mt-1 shrink-0"
            />
            <div className="text-blue-600 mt-1 shrink-0">{method.icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 dark:text-gray-100">{method.name}</div>
              <div className="text-sm text-gray-500 mt-1 dark:text-gray-400">{method.description}</div>
            </div>
            {ONLINE_METHODS.includes(method.id) && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium self-center shrink-0">
                Tự động
              </span>
            )}
          </label>
        ))}
      </div>

      {/* Bank Transfer */}
      {paymentMethod === 'transfer' && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl dark:from-gray-700 dark:to-gray-700 space-y-3">
          <h3 className="font-semibold text-green-800 dark:text-gray-100">💳 Thông tin chuyển khoản</h3>
          {loadingBank ? (
            <div className="text-green-700 dark:text-gray-300">Đang tải…</div>
          ) : bankInfo ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="text-green-700 space-y-2 dark:text-gray-300">
                  <p><strong>Ngân hàng:</strong> {bankInfo.bankName}</p>
                  <p className="flex items-center gap-2">
                    <strong>Số TK:</strong> {bankInfo.accountNumber}
                    <button type="button" onClick={() => copy(bankInfo.accountNumber, 'acc')}
                      className="px-2 py-1 text-xs rounded-md border border-green-300 hover:bg-green-100">
                      {copied.acc ? 'Đã copy' : 'Copy'}
                    </button>
                  </p>
                  <p><strong>Chủ TK:</strong> {bankInfo.accountHolder}</p>
                  <p><strong>Nội dung:</strong> {bankInfo.noteTemplate}</p>
                </div>
                {bankInfo.qrCode && (
                  <div className="flex flex-col items-center gap-2">
                    <img src={bankInfo.qrCode} alt="QR chuyển khoản"
                      className="w-36 h-36 rounded-lg border border-green-200 object-cover" loading="lazy" />
                    <a href={bankInfo.qrCode} target="_blank" rel="noreferrer" className="text-xs underline text-green-700">
                      Mở ảnh QR
                    </a>
                  </div>
                )}
              </div>
              <div className="text-sm text-green-700 bg-green-100 p-3 rounded-lg">
                Chuyển khoản xong ấn tiếp tục — chúng tôi sẽ liên hệ xác nhận qua số điện thoại.
              </div>
            </>
          ) : (
            <div className="text-green-700 dark:text-gray-300">Chưa có thông tin chuyển khoản.</div>
          )}
        </div>
      )}

      {/* Online payment gateways */}
      {gateway && (
        <div className="mt-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl dark:from-gray-700 dark:to-gray-700 space-y-4">
          <div className="flex items-center gap-3">
            <img src={gateway.logo} alt={gateway.name} className="w-10 h-10 object-contain rounded-lg shadow" />
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">Thanh toán qua {gateway.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{gateway.desc}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {gateway.supports.map(s => (
              <span key={s} className="text-xs bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full shadow-sm">
                {s}
              </span>
            ))}
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm text-amber-700 dark:text-amber-300">
            <ExternalLink className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              Sau khi ấn <strong>"Xác nhận đặt hàng"</strong>, bạn sẽ được chuyển đến trang {gateway.name} để hoàn tất thanh toán an toàn.
            </span>
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
