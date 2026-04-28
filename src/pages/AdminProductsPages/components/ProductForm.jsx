import { Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Select, TreeSelect } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AdminFeatureListField,
  AdminFormActions,
  AdminRichTextField,
  AdminUploadField
} from '@/components/admin/form'
import { getLocalizedProductCategoryTree } from '@/pages/AdminProductCategoriesPage/utils/productCategoryLocalization'
import ProductAIAssistant from './ProductAIAssistant'
import ProductCredentialManager from './ProductCredentialManager'
import ProductTranslationFields from './ProductTranslationFields'

const { RangePicker } = DatePicker

export const PRODUCT_FORM_INITIAL_VALUES = {
  status: 'active',
  discountPercentage: 0,
  stock: 0,
  deliveryEstimateDays: 0,
  deliveryType: 'manual',
  deliveryInstructions: '',
  images: []
}

export default function ProductForm({
  beforeUploadImage,
  form,
  getFileListFromEvent,
  loading,
  mode,
  onCancel,
  onSubmit,
  productId,
  treeData
}) {
  const { t, i18n } = useTranslation('adminProducts')
  const isCreate = mode === 'create'
  const prefix = `admin-product-${mode}`
  const popupClassName = `${prefix}-popup`
  const language = i18n.resolvedLanguage || i18n.language
  const localizedTreeData = useMemo(() => getLocalizedProductCategoryTree(treeData, language), [language, treeData])
  const deliveryType = Form.useWatch('deliveryType', form)

  const label = key => <span className={`${prefix}__label`}>{t(key)}</span>
  const aiLabel = (key, target, language = 'vi') => (
    <div className={`${prefix}__label-with-ai`}>
      {label(key)}
      <ProductAIAssistant classNamePrefix={prefix} form={form} language={language} target={target} />
    </div>
  )
  const costPriceRules = isCreate
    ? [{ required: true, message: t('form.costPriceRequired') }]
    : [
        { required: true, message: t('form.costPriceRequired') },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (value === undefined || value < 0) return Promise.reject(t('form.costPriceMin'))
            if (getFieldValue('price') !== undefined && value > getFieldValue('price')) {
              return Promise.reject(t('form.costPriceLimit'))
            }
            return Promise.resolve()
          }
        })
      ]
  const featureRules = isCreate ? [{ required: true, message: t('form.featureRequired') }] : undefined

  const renderUploadFields = (wrapInColumns = false) => {
    const fields = [
      <AdminUploadField
        key="thumbnail"
        addLabel={t('form.addImage')}
        beforeUpload={beforeUploadImage}
        className={`${prefix}__upload`}
        extra={<span className={`${prefix}__hint`}>{t('form.thumbnailHint')}</span>}
        getValueFromEvent={getFileListFromEvent}
        label={label('form.thumbnail')}
        maxCount={1}
        name="thumbnail"
        rules={[{ required: true, message: t('form.thumbnailRequired') }]}
        triggerClassName={`${prefix}__upload-trigger`}
        triggerTextClassName={`${prefix}__upload-text`}
      />,
      <AdminUploadField
        key="images"
        addLabel={t('form.addImage')}
        beforeUpload={beforeUploadImage}
        className={`${prefix}__upload`}
        extra={<span className={`${prefix}__hint`}>{t('form.productImagesHint')}</span>}
        getValueFromEvent={getFileListFromEvent}
        label={label('form.productImages')}
        maxCount={12}
        multiple
        name="images"
        triggerClassName={`${prefix}__upload-trigger`}
        triggerTextClassName={`${prefix}__upload-text`}
      />
    ]

    if (!wrapInColumns) return fields

    return fields.map(field => (
      <Col key={field.key} span={24}>
        {field}
      </Col>
    ))
  }

  return (
    <section className={prefix}>
      <Form
        className={`${prefix}__form`}
        form={form}
        initialValues={isCreate ? PRODUCT_FORM_INITIAL_VALUES : undefined}
        layout="vertical"
        onFinish={onSubmit}
      >
        <div className={`${prefix}__card`}>
          <div className={`${prefix}__ai-all`}>
            <span className={`${prefix}__ai-all-title`}>{t('form.ai.fullContent')}</span>
            <ProductAIAssistant classNamePrefix={prefix} form={form} target="all" />
          </div>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item name="title" label={aiLabel('form.productName', 'title')} rules={[{ required: true }]}>
                <Input className={`${prefix}__input`} placeholder={t('form.productNamePlaceholder')} />
              </Form.Item>

              <Form.Item name="productCategory" label={label('form.productCategory')} rules={[{ required: true }]}>
                <TreeSelect
                  allowClear
                  className={`${prefix}__select`}
                  dropdownClassName={popupClassName}
                  filterTreeNode={(input, treeNode) => String(treeNode.title || '').toLowerCase().includes(input.toLowerCase())}
                  placeholder={t('form.productCategoryPlaceholder')}
                  popupClassName={popupClassName}
                  showSearch
                  treeData={localizedTreeData}
                  treeDefaultExpandAll
                />
              </Form.Item>

              <Form.Item name="price" label={label('form.sellingPrice')} rules={[{ required: true }]}>
                <InputNumber className={`${prefix}__input-number`} min={0} placeholder={t('form.sellingPricePlaceholder')} />
              </Form.Item>

              <Form.Item name="costPrice" label={label('form.costPrice')} rules={costPriceRules}>
                <InputNumber className={`${prefix}__input-number`} min={0} placeholder={t('form.costPricePlaceholder')} />
              </Form.Item>

              <Form.Item name="discountPercentage" label={label('form.discount')}>
                <InputNumber className={`${prefix}__input-number`} min={0} max={100} />
              </Form.Item>

              <Form.Item name="stock" label={label('form.stock')}>
                <InputNumber className={`${prefix}__input-number`} disabled={deliveryType === 'instant_account'} min={0} />
              </Form.Item>

              <Form.Item name="deliveryType" label={label('form.deliveryType')}>
                <Select
                  className={`${prefix}__select`}
                  onChange={value => {
                    if (value === 'instant_account') form.setFieldsValue({ stock: 0 })
                  }}
                  options={[
                    { label: t('form.deliveryTypes.manual'), value: 'manual' },
                    { label: t('form.deliveryTypes.instantAccount'), value: 'instant_account' }
                  ]}
                  popupClassName={popupClassName}
                />
              </Form.Item>

              <Form.Item name="deliveryInstructions" label={aiLabel('form.deliveryInstructions', 'deliveryInstructions')}>
                <Input.TextArea
                  className={`${prefix}__textarea`}
                  placeholder={t('form.deliveryInstructionsPlaceholder')}
                  rows={3}
                />
              </Form.Item>

              {isCreate ? (
                <Form.Item
                  name="deliveryEstimateDays"
                  label={label('form.deliveryEstimateDays')}
                  rules={[{ required: true, message: t('form.deliveryEstimateDaysRequired') }]}
                >
                  <Select className={`${prefix}__select`} popupClassName={popupClassName}>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map(day => (
                      <Select.Option value={day} key={day}>
                        {t('form.dayOption', { count: day })}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null}
            </Col>

            <Col xs={24} lg={12}>
              <Form.Item name="status" label={label('form.status')}>
                <Select
                  className={`${prefix}__select`}
                  options={[
                    { label: t('status.active'), value: 'active' },
                    { label: t('status.inactive'), value: 'inactive' }
                  ]}
                  popupClassName={popupClassName}
                />
              </Form.Item>

              <Form.Item name="position" label={label('form.position')}>
                <InputNumber className={`${prefix}__input-number`} min={0} placeholder={t('form.positionPlaceholder')} />
              </Form.Item>

              <Form.Item name="slug" label={label('form.slug')}>
                <Input className={`${prefix}__input`} placeholder={t('form.slugPlaceholder')} />
              </Form.Item>

              <Form.Item name="timeRange" label={label('form.promotionTime')}>
                <RangePicker
                  className={`${prefix}__picker`}
                  format="YYYY-MM-DD"
                  popupClassName={`${prefix}-picker-popup`}
                  showTime
                />
              </Form.Item>

              <Form.Item label={label('form.options')}>
                <Row gutter={16}>
                  <Col>
                    <Form.Item name="isTopDeal" valuePropName="checked" noStyle>
                      <Checkbox className={`${prefix}__checkbox`}>{t('form.topDeal')}</Checkbox>
                    </Form.Item>
                  </Col>

                  <Col>
                    <Form.Item name="isFeatured" valuePropName="checked" noStyle>
                      <Checkbox className={`${prefix}__checkbox`}>{t('form.featured')}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              {isCreate ? renderUploadFields(false) : null}
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <AdminFeatureListField
                addButtonClassName={`${prefix}__add-feature-btn`}
                addLabel={t('form.addFeature')}
                fieldClassName={`${prefix}__features`}
                inputClassName={`${prefix}__input`}
                label={aiLabel('form.features', 'features')}
                placeholder={fieldName => t('form.featurePlaceholder', { number: fieldName + 1 })}
                removeButtonClassName={`${prefix}__remove-feature-btn`}
                removeLabel={t('form.removeFeature')}
                requiredRules={featureRules}
                rowClassName={`${prefix}__feature-row`}
              />
            </Col>

            <Col span={24}>
              <AdminRichTextField
                editorClassName={`${prefix}__editor`}
                form={form}
                label={aiLabel('form.shortDescription', 'description')}
                name="description"
              />
            </Col>

            <Col span={24}>
              <AdminRichTextField
                editorClassName={`${prefix}__editor`}
                form={form}
                label={aiLabel('form.content', 'content')}
                name="content"
              />
            </Col>

            {!isCreate ? renderUploadFields(true) : null}
          </Row>

          <ProductTranslationFields form={form} classNamePrefix={prefix} />

          {!isCreate ? <ProductCredentialManager productId={productId} enabled={deliveryType === 'instant_account'} /> : null}

          <AdminFormActions
            cancelButtonClassName={`${prefix}__btn ${prefix}__btn--cancel`}
            cancelLabel={t('form.cancel')}
            formItemClassName={`${prefix}__actions`}
            loading={loading}
            onCancel={onCancel}
            submitButtonClassName={`${prefix}__btn ${prefix}__btn--submit`}
            submitLabel={isCreate ? t('form.create') : t('form.save')}
            submittingLabel={isCreate ? t('form.creating') : t('form.saving')}
          />
        </div>
      </Form>
    </section>
  )
}
