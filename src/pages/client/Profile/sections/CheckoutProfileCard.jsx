import { Button, Card, Divider, Form, Input, Select, Typography } from 'antd'
import { CHECKOUT_PHONE_PATTERN } from '../constants'
import CheckoutAddressFields from '../components/CheckoutAddressFields'

const { Title, Text } = Typography

function CheckoutProfileCard({
  addressError,
  addressLoading,
  checkoutAddressPreview,
  checkoutDeliveryOptions,
  checkoutDistrictCode,
  checkoutForm,
  checkoutLoading,
  checkoutPaymentOptions,
  checkoutProvinceCode,
  districtOptions,
  onRestoreCheckoutProfile,
  onSaveCheckoutProfile,
  provinceOptions,
  syncCheckoutAddressFields,
  t,
  wardOptions
}) {
  return (
    <Card
      className="mt-7 rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      styles={{ body: { padding: '28px' } }}
    >
      <div className="mb-6">
        <Title level={4} className="!mb-2 !text-xl !font-semibold !text-gray-900 dark:!text-white">
          {t('checkoutProfile.title')}
        </Title>

        <Text className="block max-w-3xl !text-sm !leading-7 !text-gray-600 dark:!text-gray-300">
          {t('checkoutProfile.description')}
        </Text>
      </div>

      <Form form={checkoutForm} layout="vertical" onFinish={onSaveCheckoutProfile} size="large">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Form.Item
            label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('checkoutProfile.firstName')}</span>}
            name="firstName"
            className="mb-0"
          >
            <Input
              placeholder={t('checkoutProfile.firstNamePlaceholder')}
              className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('checkoutProfile.lastName')}</span>}
            name="lastName"
            className="mb-0"
          >
            <Input
              placeholder={t('checkoutProfile.lastNamePlaceholder')}
              className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('checkoutProfile.phone')}</span>}
            name="phone"
            rules={[
              {
                pattern: CHECKOUT_PHONE_PATTERN,
                message: t('form.phoneInvalid')
              }
            ]}
            className="mb-0"
          >
            <Input
              placeholder={t('checkoutProfile.phonePlaceholder')}
              maxLength={15}
              className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('checkoutProfile.email')}</span>}
            name="email"
            rules={[
              {
                type: 'email',
                message: t('emailModal.newEmailInvalid')
              }
            ]}
            className="mb-0"
          >
            <Input
              placeholder={t('checkoutProfile.emailPlaceholder')}
              className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('checkoutProfile.deliveryMethod')}</span>}
            name="deliveryMethod"
            className="mb-0"
          >
            <Select options={checkoutDeliveryOptions} className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('checkoutProfile.paymentMethod')}</span>}
            name="paymentMethod"
            className="mb-0"
          >
            <Select options={checkoutPaymentOptions} className="rounded-lg" />
          </Form.Item>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/30">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('checkoutProfile.address.title')}</h3>
            <p className="mt-2 mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {t('checkoutProfile.address.description')}
            </p>
          </div>

          <CheckoutAddressFields
            addressError={addressError}
            addressLoading={addressLoading}
            checkoutAddressPreview={checkoutAddressPreview}
            checkoutDistrictCode={checkoutDistrictCode}
            checkoutProvinceCode={checkoutProvinceCode}
            districtOptions={districtOptions}
            provinceOptions={provinceOptions}
            syncCheckoutAddressFields={syncCheckoutAddressFields}
            t={t}
            wardOptions={wardOptions}
          />
        </div>

        <Form.Item name="provinceName" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="districtName" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="wardName" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="address" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('checkoutProfile.notes')}</span>}
          name="notes"
          className="mt-5 mb-0"
        >
          <Input.TextArea
            rows={3}
            placeholder={t('checkoutProfile.notesPlaceholder')}
            className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          />
        </Form.Item>

        <Divider className="my-7" />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            size="large"
            className="h-auto rounded-lg border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 hover:!border-gray-300 hover:!text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            onClick={onRestoreCheckoutProfile}
          >
            {t('checkoutProfile.restore')}
          </Button>

          <Button
            htmlType="submit"
            loading={checkoutLoading}
            size="large"
            className="h-auto rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:!bg-gray-800 hover:!text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:!bg-white"
          >
            {checkoutLoading ? t('checkoutProfile.saving') : t('checkoutProfile.save')}
          </Button>
        </div>
      </Form>
    </Card>
  )
}

export default CheckoutProfileCard
