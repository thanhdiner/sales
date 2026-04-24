import { Select } from 'antd'
import { useSelector } from 'react-redux'
import useVietnamAddress from '@/hooks/useVietnamAddress'
import {
  getDistrictOptions,
  getProvinceOptions,
  getWardOptions,
  hasCompleteStructuredVietnamAddress
} from '@/lib/vietnamAddress'

const toSelectOptions = items =>
  items.map(item => ({
    value: item.code,
    label: item.name
  }))

const sharedSelectProps = {
  allowClear: true,
  showSearch: true,
  optionFilterProp: 'label',
  size: 'large'
}

export function ContactForm({
  formData,
  handleInputChange,
  handleAddressChange,
  deliveryMethod,
  setDeliveryMethod,
  deliveryOptions
}) {
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const contactInfo = websiteConfig?.contactInfo
  const { tree, loading, error } = useVietnamAddress()

  const provinceOptions = getProvinceOptions(tree)
  const districtOptions = getDistrictOptions(tree, formData.provinceCode)
  const wardOptions = getWardOptions(tree, formData.provinceCode, formData.districtCode)
  const structuredAddressReady = hasCompleteStructuredVietnamAddress(formData)

  const inputClassName =
    'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-400'

  const handleProvinceSelect = value => {
    const nextProvince = provinceOptions.find(option => option.code === value)

    handleAddressChange({
      provinceCode: value || '',
      provinceName: nextProvince?.name || '',
      districtCode: '',
      districtName: '',
      wardCode: '',
      wardName: ''
    })
  }

  const handleDistrictSelect = value => {
    const nextDistrict = districtOptions.find(option => option.code === value)

    handleAddressChange({
      districtCode: value || '',
      districtName: nextDistrict?.name || '',
      wardCode: '',
      wardName: ''
    })
  }

  const handleWardSelect = value => {
    const nextWard = wardOptions.find(option => option.code === value)

    handleAddressChange({
      wardCode: value || '',
      wardName: nextWard?.name || ''
    })
  }

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
            placeholder="Nguyen"
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
            placeholder="Van A"
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

      <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Địa chỉ nhận hàng
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Chọn theo từng cấp để hạn chế nhập sai địa chỉ. Nếu đơn của bạn không cần giao vật lý, có thể để trống phần này.
          </p>
        </div>

        {error ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              Không tải được danh sách địa chỉ Việt Nam. Bạn có thể nhập tạm địa chỉ thủ công.
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Địa chỉ / thông tin nhận hàng
              </label>
              <textarea
                value={formData.address}
                onChange={e => handleInputChange('address', e.target.value)}
                rows={3}
                className={`${inputClassName} resize-none`}
                placeholder="Ví dụ: số nhà, đường, phường/xã, quận/huyện, tỉnh/thành..."
              />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tỉnh / Thành phố
                </label>
                <Select
                  {...sharedSelectProps}
                  loading={loading}
                  value={formData.provinceCode || undefined}
                  onChange={handleProvinceSelect}
                  options={toSelectOptions(provinceOptions)}
                  placeholder="Chọn Tỉnh / Thành phố"
                  className="w-full"
                  getPopupContainer={node => node.parentElement}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quận / Huyện
                </label>
                <Select
                  {...sharedSelectProps}
                  loading={loading}
                  disabled={!formData.provinceCode}
                  value={formData.districtCode || undefined}
                  onChange={handleDistrictSelect}
                  options={toSelectOptions(districtOptions)}
                  placeholder={formData.provinceCode ? 'Chọn Quận / Huyện' : 'Chọn Tỉnh / Thành phố trước'}
                  className="w-full"
                  getPopupContainer={node => node.parentElement}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phường / Xã
                </label>
                <Select
                  {...sharedSelectProps}
                  loading={loading}
                  disabled={!formData.districtCode}
                  value={formData.wardCode || undefined}
                  onChange={handleWardSelect}
                  options={toSelectOptions(wardOptions)}
                  placeholder={formData.districtCode ? 'Chọn Phường / Xã' : 'Chọn Quận / Huyện trước'}
                  className="w-full"
                  getPopupContainer={node => node.parentElement}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Địa chỉ chi tiết
              </label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={e => handleAddressChange({ addressLine1: e.target.value })}
                className={inputClassName}
                placeholder="Số nhà, tên đường, tòa nhà, hẻm..."
              />
            </div>

            {structuredAddressReady && formData.address && (
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <span className="font-medium text-gray-900 dark:text-gray-100">Địa chỉ đầy đủ:</span>{' '}
                {formData.address}
              </div>
            )}
          </>
        )}
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
