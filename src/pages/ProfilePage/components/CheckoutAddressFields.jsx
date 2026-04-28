import { Form, Input, Select } from 'antd'

function CheckoutAddressFields({
  addressError,
  addressLoading,
  checkoutAddressPreview,
  checkoutDistrictCode,
  checkoutProvinceCode,
  districtOptions,
  provinceOptions,
  syncCheckoutAddressFields,
  t,
  wardOptions
}) {
  if (addressError) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          {t('checkoutProfile.address.loadError')}
        </div>

        <Form.Item
          label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('checkoutProfile.address.manualLabel')}</span>}
          name="address"
          className="mb-0"
        >
          <Input.TextArea
            rows={3}
            placeholder={t('checkoutProfile.address.manualPlaceholder')}
            className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          />
        </Form.Item>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Form.Item
          label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('checkoutProfile.address.province')}</span>}
          name="provinceCode"
          className="mb-0"
        >
          <Select
            showSearch
            allowClear
            loading={addressLoading}
            options={provinceOptions}
            placeholder={t('checkoutProfile.address.provincePlaceholder')}
            optionFilterProp="label"
            className="rounded-lg"
            onChange={value => {
              const nextProvince = provinceOptions.find(option => option.value === value)
              syncCheckoutAddressFields({
                provinceCode: value || '',
                provinceName: nextProvince?.label || '',
                districtCode: '',
                districtName: '',
                wardCode: '',
                wardName: ''
              })
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('checkoutProfile.address.district')}</span>}
          name="districtCode"
          className="mb-0"
        >
          <Select
            showSearch
            allowClear
            loading={addressLoading}
            disabled={!checkoutProvinceCode}
            options={districtOptions}
            placeholder={
              checkoutProvinceCode
                ? t('checkoutProfile.address.districtPlaceholder')
                : t('checkoutProfile.address.districtPlaceholderDisabled')
            }
            optionFilterProp="label"
            className="rounded-lg"
            onChange={value => {
              const nextDistrict = districtOptions.find(option => option.value === value)
              syncCheckoutAddressFields({
                districtCode: value || '',
                districtName: nextDistrict?.label || '',
                wardCode: '',
                wardName: ''
              })
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('checkoutProfile.address.ward')}</span>}
          name="wardCode"
          className="mb-0"
        >
          <Select
            showSearch
            allowClear
            loading={addressLoading}
            disabled={!checkoutDistrictCode}
            options={wardOptions}
            placeholder={
              checkoutDistrictCode ? t('checkoutProfile.address.wardPlaceholder') : t('checkoutProfile.address.wardPlaceholderDisabled')
            }
            optionFilterProp="label"
            className="rounded-lg"
            onChange={value => {
              const nextWard = wardOptions.find(option => option.value === value)
              syncCheckoutAddressFields({
                wardCode: value || '',
                wardName: nextWard?.label || ''
              })
            }}
          />
        </Form.Item>
      </div>

      <Form.Item
        label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('checkoutProfile.address.detail')}</span>}
        name="addressLine1"
        className="mt-5 mb-0"
      >
        <Input
          placeholder={t('checkoutProfile.address.detailPlaceholder')}
          className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          onChange={event => syncCheckoutAddressFields({ addressLine1: event.target.value })}
        />
      </Form.Item>

      {checkoutAddressPreview && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <span className="font-medium text-gray-900 dark:text-gray-100">{t('checkoutProfile.address.fullAddress')}</span>{' '}
          {checkoutAddressPreview}
        </div>
      )}
    </>
  )
}

export default CheckoutAddressFields
