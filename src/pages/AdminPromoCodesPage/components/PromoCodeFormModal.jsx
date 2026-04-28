import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Switch } from 'antd'
import {
  formatPromoCodeNumberInput,
  formatPromoCodePercentInput,
  getPromoCodeDatePickerFormat,
  parsePromoCodeNumericInput,
  PROMO_CODE_FORM_INITIAL_VALUES
} from '../utils/promoCodeHelpers'

const inputClass =
  '!border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'
const labelClass = 'text-[var(--admin-text-muted)]'
const secondaryButtonClass =
  '!border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
const primaryButtonClass =
  '!border-none !bg-[var(--admin-accent)] !text-white hover:!opacity-90'

function FormSection({ title, children }) {
  return (
    <section className="admin-promo-form-section">
      <h3 className="admin-promo-form-section__title">{title}</h3>
      {children}
    </section>
  )
}

export default function PromoCodeFormModal({ open, editingCode, form, loading, language, t, onCancel, onSubmit }) {
  const discountType = Form.useWatch('discountType', form)
  const audienceType = Form.useWatch('audienceType', form)
  const datePickerFormat = getPromoCodeDatePickerFormat(language)
  const isFreeShipping = discountType === 'free_shipping'

  const discountTypeOptions = [
    { value: 'percent', label: t('form.discountTypes.percent') },
    { value: 'fixed', label: t('form.discountTypes.amount') },
    { value: 'free_shipping', label: t('form.discountTypes.freeShipping') }
  ]
  const categoryOptions = ['all', 'new', 'flash', 'shipping', 'vip', 'weekend', 'student'].map(category => ({
    value: category,
    label: t(`categories.${category}`)
  }))
  const audienceOptions = ['all_customers', 'new_customers', 'specific_customers', 'customer_groups'].map(audience => ({
    value: audience,
    label: t(`audience.${audience}`)
  }))

  const handleSaveDraft = async () => {
    try {
      const values = await form.validateFields()
      await onSubmit({ ...values, isActive: false })
    } catch {
      // Ant Design handles field errors inline.
    }
  }

  return (
    <Modal
      title={
        editingCode ? (
          <span className="text-[var(--admin-text)]">{t('form.titleEdit')}</span>
        ) : (
          <span className="text-[var(--admin-text)]">{t('form.titleCreate')}</span>
        )
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={900}
      className="admin-promo-form-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={PROMO_CODE_FORM_INITIAL_VALUES}
        className="[&_.ant-form-item-label>label]:text-[var(--admin-text-muted)]"
      >
        <FormSection title={t('form.sections.basic')}>
          <Row gutter={[16, 0]}>
            <Col xs={24} md={10}>
              <Form.Item
                name="code"
                label={<span className={labelClass}>{t('form.code')}</span>}
                rules={[{ required: true, message: t('form.codeRequired') }]}
              >
                <Input placeholder={t('form.codePlaceholder')} className={inputClass} />
              </Form.Item>
            </Col>

            <Col xs={24} md={10}>
              <Form.Item name="title" label={<span className={labelClass}>{t('form.campaignName')}</span>}>
                <Input placeholder={t('form.campaignPlaceholder')} className={inputClass} />
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item
                name="isActive"
                label={<span className={labelClass}>{t('form.status')}</span>}
                valuePropName="checked"
              >
                <Switch checkedChildren={t('form.active')} unCheckedChildren={t('form.inactive')} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label={<span className={labelClass}>{t('form.description')}</span>}>
            <Input.TextArea
              rows={3}
              placeholder={t('form.descriptionPlaceholder')}
              className={inputClass}
            />
          </Form.Item>

          <div className="admin-promo-form-modal__translation-section">
            <h4 className="admin-promo-form-modal__translation-title">{t('form.translations.sectionTitle')}</h4>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item name={['translations', 'en', 'title']} label={<span className={labelClass}>{t('form.translations.title')}</span>}>
                  <Input placeholder={t('form.translations.titlePlaceholder')} className={inputClass} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item name={['translations', 'en', 'description']} label={<span className={labelClass}>{t('form.translations.description')}</span>}>
                  <Input placeholder={t('form.translations.descriptionPlaceholder')} className={inputClass} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </FormSection>

        <FormSection title={t('form.sections.discount')}>
          <Row gutter={[16, 0]}>
            <Col xs={24} md={8}>
              <Form.Item
                name="discountType"
                label={<span className={labelClass}>{t('form.discountType')}</span>}
                rules={[{ required: true, message: t('form.discountTypeRequired') }]}
              >
                <Select options={discountTypeOptions} className="admin-promo-select" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="discountValue"
                label={<span className={labelClass}>{t('form.discountValue')}</span>}
                rules={isFreeShipping ? [] : [{ required: true, message: t('form.discountValueRequired') }]}
              >
                <InputNumber
                  min={0}
                  max={discountType === 'percent' ? 100 : undefined}
                  disabled={isFreeShipping}
                  className="admin-promo-input-number"
                  style={{ width: '100%' }}
                  placeholder={isFreeShipping ? t('form.freeShippingValuePlaceholder') : undefined}
                  formatter={value =>
                    discountType === 'percent'
                      ? formatPromoCodePercentInput(value)
                      : formatPromoCodeNumberInput(value, language)
                  }
                  parser={parsePromoCodeNumericInput}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item name="maxDiscount" label={<span className={labelClass}>{t('form.maxDiscount')}</span>}>
                <InputNumber
                  min={0}
                  disabled={isFreeShipping}
                  className="admin-promo-input-number"
                  style={{ width: '100%' }}
                  formatter={value => formatPromoCodeNumberInput(value, language)}
                  parser={parsePromoCodeNumericInput}
                />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        <FormSection title={t('form.sections.conditions')}>
          <Row gutter={[16, 0]}>
            <Col xs={24} md={8}>
              <Form.Item name="minOrder" label={<span className={labelClass}>{t('form.minOrder')}</span>}>
                <InputNumber
                  min={0}
                  className="admin-promo-input-number"
                  style={{ width: '100%' }}
                  formatter={value => formatPromoCodeNumberInput(value, language)}
                  parser={parsePromoCodeNumericInput}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item name="applicableProducts" label={<span className={labelClass}>{t('form.applicableProducts')}</span>}>
                <Select mode="tags" placeholder={t('form.applicableProductsPlaceholder')} className="admin-promo-select" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item name="applicableCategories" label={<span className={labelClass}>{t('form.applicableCategories')}</span>}>
                <Select mode="tags" placeholder={t('form.applicableCategoriesPlaceholder')} className="admin-promo-select" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="excludedProducts" label={<span className={labelClass}>{t('form.excludedProducts')}</span>}>
            <Select mode="tags" placeholder={t('form.excludedProductsPlaceholder')} className="admin-promo-select" />
          </Form.Item>
        </FormSection>

        <FormSection title={t('form.sections.usage')}>
          <Row gutter={[16, 0]}>
            <Col xs={24} md={8}>
              <Form.Item name="usageLimit" label={<span className={labelClass}>{t('form.usageLimit')}</span>}>
                <InputNumber
                  min={1}
                  className="admin-promo-input-number"
                  style={{ width: '100%' }}
                  placeholder={t('form.usageLimitPlaceholder')}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item name="usagePerCustomer" label={<span className={labelClass}>{t('form.usagePerCustomer')}</span>}>
                <InputNumber
                  min={1}
                  className="admin-promo-input-number"
                  style={{ width: '100%' }}
                  placeholder={t('form.usagePerCustomerPlaceholder')}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="newCustomersOnly"
                label={<span className={labelClass}>{t('form.newCustomersOnly')}</span>}
                valuePropName="checked"
              >
                <Switch checkedChildren={t('common.yes')} unCheckedChildren={t('common.no')} />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        <FormSection title={t('form.sections.audience')}>
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item name="audienceType" label={<span className={labelClass}>{t('form.audienceType')}</span>}>
                <Select options={audienceOptions} className="admin-promo-select" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="category" label={<span className={labelClass}>{t('form.category')}</span>}>
                <Select options={categoryOptions} className="admin-promo-select" />
              </Form.Item>
            </Col>
          </Row>

          {audienceType === 'specific_customers' ? (
            <Form.Item name="specificCustomers" label={<span className={labelClass}>{t('form.specificCustomers')}</span>}>
              <Select mode="tags" placeholder={t('form.specificCustomersPlaceholder')} className="admin-promo-select" />
            </Form.Item>
          ) : null}

          {audienceType === 'customer_groups' ? (
            <Form.Item name="customerGroups" label={<span className={labelClass}>{t('form.customerGroups')}</span>}>
              <Select mode="tags" placeholder={t('form.customerGroupsPlaceholder')} className="admin-promo-select" />
            </Form.Item>
          ) : null}
        </FormSection>

        <FormSection title={t('form.sections.schedule')}>
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item name="startsAt" label={<span className={labelClass}>{t('form.startsAt')}</span>}>
                <DatePicker
                  showTime
                  className="admin-promo-date-picker"
                  style={{ width: '100%' }}
                  format={`${datePickerFormat} HH:mm`}
                  placeholder={t('form.startsAtPlaceholder')}
                  allowClear
                  popupClassName="admin-promo-date-popup"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="expiresAt" label={<span className={labelClass}>{t('form.expiresAt')}</span>}>
                <DatePicker
                  showTime
                  className="admin-promo-date-picker"
                  style={{ width: '100%' }}
                  format={`${datePickerFormat} HH:mm`}
                  placeholder={t('form.expiresAtPlaceholder')}
                  allowClear
                  popupClassName="admin-promo-date-popup"
                />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        <div className="admin-promo-form-actions">
          <Button onClick={onCancel} className={secondaryButtonClass}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSaveDraft} loading={loading} className={secondaryButtonClass}>
            {t('form.saveDraft')}
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} className={primaryButtonClass}>
            {t('form.savePromoCode')}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
