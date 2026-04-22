import { useEffect, useState } from 'react'
import { message } from 'antd'
import { getActiveBankInfo } from '@/services/bankInfo.service'

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

  const inputClassName =
    'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-400'

  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Phương thức thanh toán
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Chọn cách thanh toán phù hợp để hoàn tất đơn hàng.
        </p>
      </div>

      <div className="space-y-3">
        {paymentMethods.map(method => {
          const isSelected = paymentMethod === method.id

          return (
            <label
              key={method.id}
              className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors ${
                isSelected
                  ? 'border-gray-900 bg-gray-50 dark:border-gray-200 dark:bg-gray-900/30'
                  : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={isSelected}
                onChange={e => setPaymentMethod(e.target.value)}
                className="mt-1 h-4 w-4 accent-gray-900 dark:accent-gray-100"
              />

              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {method.name}
                </div>

                <div className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {method.description}
                </div>
              </div>
            </label>
          )
        })}
      </div>

      {paymentMethod === 'transfer' && (
        <div className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Thông tin chuyển khoản
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Vui lòng chuyển khoản theo thông tin bên dưới để shop xác nhận đơn hàng.
            </p>
          </div>

          {loadingBank ? (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Đang tải thông tin ngân hàng...
            </div>
          ) : bankInfo ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Ngân hàng
                    </p>
                    <p className="mb-0 text-sm text-gray-600 dark:text-gray-300">
                      {bankInfo.bankName}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Số tài khoản
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <p className="mb-0 text-sm text-gray-600 dark:text-gray-300">
                        {bankInfo.accountNumber}
                      </p>

                      <button
                        type="button"
                        onClick={() => copy(bankInfo.accountNumber, 'acc')}
                        className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        {copied.acc ? 'Đã copy' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Chủ tài khoản
                    </p>
                    <p className="mb-0 text-sm text-gray-600 dark:text-gray-300">
                      {bankInfo.accountHolder}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Nội dung chuyển khoản
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <p className="mb-0 text-sm text-gray-600 dark:text-gray-300">
                        {bankInfo.noteTemplate}
                      </p>

                      {bankInfo.noteTemplate && (
                        <button
                          type="button"
                          onClick={() => copy(bankInfo.noteTemplate, 'note')}
                          className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          {copied.note ? 'Đã copy' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {bankInfo.qrCode && (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <img
                      src={bankInfo.qrCode}
                      alt="QR chuyển khoản"
                      className="h-44 w-44 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
                      loading="lazy"
                    />

                    <a
                      href={bankInfo.qrCode}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-gray-700 underline underline-offset-4 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      Mở ảnh QR
                    </a>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Sau khi chuyển khoản, bạn có thể tiếp tục đặt hàng. Shop sẽ liên hệ qua số điện thoại đã đăng ký để xác nhận thanh toán.
                </p>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Chưa có thông tin chuyển khoản.
            </div>
          )}
        </div>
      )}

      {paymentMethod === 'card' && (
        <div className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Thông tin thẻ
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Số thẻ
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={e => handleInputChange('cardNumber', e.target.value)}
                className={inputClassName}
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tên trên thẻ
              </label>
              <input
                type="text"
                value={formData.cardName}
                onChange={e => handleInputChange('cardName', e.target.value)}
                className={inputClassName}
                placeholder="NGUYEN VAN A"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ngày hết hạn
                </label>
                <input
                  type="text"
                  value={formData.expiryDate}
                  onChange={e => handleInputChange('expiryDate', e.target.value)}
                  className={inputClassName}
                  placeholder="MM/YY"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  CVV
                </label>
                <input
                  type="text"
                  value={formData.cvv}
                  onChange={e => handleInputChange('cvv', e.target.value)}
                  className={inputClassName}
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
        <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Thanh toán được xử lý qua kết nối bảo mật để bảo vệ thông tin của bạn.
        </p>
      </div>
    </div>
  )
}