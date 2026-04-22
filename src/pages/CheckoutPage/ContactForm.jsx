import { useSelector } from 'react-redux'

export function ContactForm({ formData, handleInputChange, deliveryMethod, setDeliveryMethod, deliveryOptions }) {
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const contactInfo = websiteConfig?.contactInfo

  const inputClassName =
    'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-400'

  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Thông tin liên hệ
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Nhập thông tin để shop có thể xác nhận và xử lý đơn hàng của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Họ <span className="text-gray-400">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            required
            onChange={e => handleInputChange('firstName', e.target.value)}
            className={inputClassName}
            placeholder="Nguyễn"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tên <span className="text-gray-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={e => handleInputChange('lastName', e.target.value)}
            className={inputClassName}
            placeholder="Văn A"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Số điện thoại <span className="text-gray-400">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={e => handleInputChange('phone', e.target.value)}
            className={inputClassName}
            placeholder="0123456789"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email <span className="text-gray-400">(tùy chọn)</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            className={inputClassName}
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Ghi chú
        </label>
        <textarea
          value={formData.notes}
          onChange={e => handleInputChange('notes', e.target.value)}
          rows={3}
          className={`${inputClassName} resize-none`}
          placeholder="Mô tả sản phẩm cần mua, thời gian mong muốn nhận hàng hoặc yêu cầu đặc biệt..."
        />
      </div>

      <div>
        <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
          Cách thức nhận hàng
        </h3>

        <div className="space-y-3">
          {deliveryOptions.map(option => {
            const isSelected = deliveryMethod === option.id

            return (
              <label
                key={option.id}
                className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors ${
                  isSelected
                    ? 'border-gray-900 bg-gray-50 dark:border-gray-200 dark:bg-gray-900/30'
                    : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value={option.id}
                  checked={isSelected}
                  onChange={e => setDeliveryMethod(e.target.value)}
                  className="mt-1 h-4 w-4 accent-gray-900 dark:accent-gray-100"
                />

                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {option.name}
                  </div>

                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {option.time}
                  </div>

                  <div className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {option.description}
                  </div>
                </div>

                <div className="shrink-0 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Miễn phí
                </div>
              </label>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Thông tin cửa hàng
        </h4>

        <div className="mt-3 space-y-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          <p className="mb-0">
            <span className="font-medium text-gray-900 dark:text-gray-100">Email:</span>{' '}
            {contactInfo?.email || 'lunashop.business.official@gmail.com'}
          </p>

          <p className="mb-0">
            <span className="font-medium text-gray-900 dark:text-gray-100">Hotline:</span>{' '}
            {contactInfo?.phone || '0923387108'}
          </p>

          <p className="mb-0">
            <span className="font-medium text-gray-900 dark:text-gray-100">Giờ mở cửa:</span>{' '}
            8:00 - 21:00 hàng ngày
          </p>
        </div>
      </div>
    </div>
  )
}