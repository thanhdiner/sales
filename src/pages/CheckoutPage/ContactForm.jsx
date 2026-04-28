import { Select } from 'antd'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import useVietnamAddress from '@/hooks/useVietnamAddress'
import { getDistrictOptions, getProvinceOptions, getWardOptions, hasCompleteStructuredVietnamAddress } from '@/lib/vietnamAddress'

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

export function ContactForm({ formData, handleInputChange, handleAddressChange, deliveryMethod, setDeliveryMethod, deliveryOptions }) {
  const { t } = useTranslation('clientCheckout')
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('contactForm.title')}</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{t('contactForm.description')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('contactForm.fields.firstName')} <span className="text-gray-400">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            required
            onChange={e => handleInputChange('firstName', e.target.value)}
            className={inputClassName}
            placeholder={t('contactForm.placeholders.firstName')}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('contactForm.fields.lastName')} <span className="text-gray-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={e => handleInputChange('lastName', e.target.value)}
            className={inputClassName}
            placeholder={t('contactForm.placeholders.lastName')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('contactForm.fields.phone')} <span className="text-gray-400">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={e => handleInputChange('phone', e.target.value)}
            className={inputClassName}
            placeholder={t('contactForm.placeholders.phone')}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('contactForm.fields.email')} <span className="text-gray-400">({t('contactForm.fields.optional')})</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            className={inputClassName}
            placeholder={t('contactForm.placeholders.email')}
          />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('contactForm.address.title')}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{t('contactForm.address.description')}</p>
        </div>

        {error ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              {t('contactForm.address.loadError')}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('contactForm.address.manualLabel')}
              </label>
              <textarea
                value={formData.address}
                onChange={e => handleInputChange('address', e.target.value)}
                rows={3}
                className={`${inputClassName} resize-none`}
                placeholder={t('contactForm.address.manualPlaceholder')}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('contactForm.address.province')}
                </label>
                <Select
                  {...sharedSelectProps}
                  loading={loading}
                  value={formData.provinceCode || undefined}
                  onChange={handleProvinceSelect}
                  options={toSelectOptions(provinceOptions)}
                  placeholder={t('contactForm.address.provincePlaceholder')}
                  className="w-full"
                  getPopupContainer={node => node.parentElement}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('contactForm.address.district')}
                </label>
                <Select
                  {...sharedSelectProps}
                  loading={loading}
                  disabled={!formData.provinceCode}
                  value={formData.districtCode || undefined}
                  onChange={handleDistrictSelect}
                  options={toSelectOptions(districtOptions)}
                  placeholder={
                    formData.provinceCode
                      ? t('contactForm.address.districtPlaceholder')
                      : t('contactForm.address.districtPlaceholderDisabled')
                  }
                  className="w-full"
                  getPopupContainer={node => node.parentElement}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('contactForm.address.ward')}</label>
                <Select
                  {...sharedSelectProps}
                  loading={loading}
                  disabled={!formData.districtCode}
                  value={formData.wardCode || undefined}
                  onChange={handleWardSelect}
                  options={toSelectOptions(wardOptions)}
                  placeholder={
                    formData.districtCode ? t('contactForm.address.wardPlaceholder') : t('contactForm.address.wardPlaceholderDisabled')
                  }
                  className="w-full"
                  getPopupContainer={node => node.parentElement}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('contactForm.address.detail')}</label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={e => handleAddressChange({ addressLine1: e.target.value })}
                className={inputClassName}
                placeholder={t('contactForm.address.detailPlaceholder')}
              />
            </div>

            {structuredAddressReady && formData.address && (
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <span className="font-medium text-gray-900 dark:text-gray-100">{t('contactForm.address.fullAddress')}</span>{' '}
                {formData.address}
              </div>
            )}
          </>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('contactForm.fields.notes')}</label>
        <textarea
          value={formData.notes}
          onChange={e => handleInputChange('notes', e.target.value)}
          rows={3}
          className={`${inputClassName} resize-none`}
          placeholder={t('contactForm.placeholders.notes')}
        />
      </div>

      <div>
        <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">{t('contactForm.delivery.title')}</h3>

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
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{option.name}</div>

                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{option.time}</div>

                  <div className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{option.description}</div>
                </div>

                <div className="shrink-0 text-sm font-semibold text-gray-700 dark:text-gray-200">{t('contactForm.delivery.free')}</div>
              </label>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('contactForm.storeInfo.title')}</h4>

        <div className="mt-3 space-y-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          <p className="mb-0">
            <span className="font-medium text-gray-900 dark:text-gray-100">{t('contactForm.storeInfo.email')}</span>{' '}
            {contactInfo?.email || 'lunashop.business.official@gmail.com'}
          </p>

          <p className="mb-0">
            <span className="font-medium text-gray-900 dark:text-gray-100">{t('contactForm.storeInfo.hotline')}</span>{' '}
            {contactInfo?.phone || '0923387108'}
          </p>

          <p className="mb-0">
            <span className="font-medium text-gray-900 dark:text-gray-100">{t('contactForm.storeInfo.openingHours')}</span>{' '}
            {t('contactForm.storeInfo.openingHoursValue')}
          </p>
        </div>
      </div>
    </div>
  )
}
