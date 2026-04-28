import { PlusOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Select, TreeSelect, Upload } from 'antd'
import { useMemo } from 'react'
import TiptapEditor from '@/components/TiptapEditor'
import ProductTranslationFields from '../components/ProductTranslationFields'
import ProductCredentialManager from '../components/ProductCredentialManager'
import { useAdminProductEdit } from '../hooks/useAdminProductEdit'
import { getLocalizedProductCategoryTree } from '@/pages/AdminProductCategoriesPage/utils/productCategoryLocalization'
import { useTranslation } from 'react-i18next'
import './AdminProductsEdit.scss'

const { RangePicker } = DatePicker

function AdminProductsEdit() {
  const { t, i18n } = useTranslation('adminProducts')
  const { form, id, loading, treeData, handleSubmit, getFileListFromEvent, beforeUploadImage, navigate, pathNavigate } =
    useAdminProductEdit()
  const language = i18n.resolvedLanguage || i18n.language
  const localizedTreeData = useMemo(() => getLocalizedProductCategoryTree(treeData, language), [language, treeData])
  const deliveryType = Form.useWatch('deliveryType', form)
  const description = Form.useWatch('description', form)
  const content = Form.useWatch('content', form)

  return (
    <section className="admin-product-edit">
      <Form form={form} layout="vertical" onFinish={handleSubmit} className="admin-product-edit__form">
        <div className="admin-product-edit__card">
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item name="title" label={<span className="admin-product-edit__label">{t('form.productName')}</span>} rules={[{ required: true }]}>
                <Input className="admin-product-edit__input" placeholder={t('form.productNamePlaceholder')} />
              </Form.Item>

              <Form.Item name="productCategory" label={<span className="admin-product-edit__label">{t('form.productCategory')}</span>} rules={[{ required: true }]}>
                <TreeSelect
                  className="admin-product-edit__select"
                  popupClassName="admin-product-edit-popup"
                  dropdownClassName="admin-product-edit-popup"
                  treeData={localizedTreeData}
                  placeholder={t('form.productCategoryPlaceholder')}
                  treeDefaultExpandAll
                  allowClear
                  showSearch
                  filterTreeNode={(input, treeNode) => String(treeNode.title || '').toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>

              <Form.Item name="price" label={<span className="admin-product-edit__label">{t('form.sellingPrice')}</span>} rules={[{ required: true }]}>
                <InputNumber className="admin-product-edit__input-number" placeholder={t('form.sellingPricePlaceholder')} min={0} />
              </Form.Item>

              <Form.Item
                name="costPrice"
                label={<span className="admin-product-edit__label">{t('form.costPrice')}</span>}
                rules={[
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
                ]}
              >
                <InputNumber className="admin-product-edit__input-number" placeholder={t('form.costPricePlaceholder')} min={0} />
              </Form.Item>

              <Form.Item name="discountPercentage" label={<span className="admin-product-edit__label">{t('form.discount')}</span>}>
                <InputNumber className="admin-product-edit__input-number" min={0} max={100} />
              </Form.Item>

              <Form.Item name="stock" label={<span className="admin-product-edit__label">{t('form.stock')}</span>}>
                <InputNumber className="admin-product-edit__input-number" min={0} disabled={deliveryType === 'instant_account'} />
              </Form.Item>

              <Form.Item name="deliveryType" label={<span className="admin-product-edit__label">{t('form.deliveryType')}</span>}>
                <Select
                  className="admin-product-edit__select"
                  popupClassName="admin-product-edit-popup"
                  onChange={value => {
                    if (value === 'instant_account') form.setFieldsValue({ stock: 0 })
                  }}
                  options={[
                    { label: t('form.deliveryTypes.manual'), value: 'manual' },
                    { label: t('form.deliveryTypes.instantAccount'), value: 'instant_account' }
                  ]}
                />
              </Form.Item>

              <Form.Item name="deliveryInstructions" label={<span className="admin-product-edit__label">{t('form.deliveryInstructions')}</span>}>
                <Input.TextArea
                  className="admin-product-edit__textarea"
                  rows={3}
                  placeholder={t('form.deliveryInstructionsPlaceholder')}
                />
              </Form.Item>
            </Col>

            <Col xs={24} lg={12}>
              <Form.Item name="status" label={<span className="admin-product-edit__label">{t('form.status')}</span>}>
                <Select
                  className="admin-product-edit__select"
                  popupClassName="admin-product-edit-popup"
                  options={[
                    { label: t('status.active'), value: 'active' },
                    { label: t('status.inactive'), value: 'inactive' }
                  ]}
                />
              </Form.Item>

              <Form.Item name="position" label={<span className="admin-product-edit__label">{t('form.position')}</span>}>
                <InputNumber className="admin-product-edit__input-number" placeholder={t('form.positionPlaceholder')} min={0} />
              </Form.Item>

              <Form.Item name="slug" label={<span className="admin-product-edit__label">{t('form.slug')}</span>}>
                <Input className="admin-product-edit__input" placeholder={t('form.slugPlaceholder')} />
              </Form.Item>

              <Form.Item name="timeRange" label={<span className="admin-product-edit__label">{t('form.promotionTime')}</span>}>
                <RangePicker className="admin-product-edit__picker" popupClassName="admin-product-edit-picker-popup" format="YYYY-MM-DD" showTime />
              </Form.Item>

              <Form.Item label={<span className="admin-product-edit__label">{t('form.options')}</span>}>
                <Row gutter={16}>
                  <Col>
                    <Form.Item name="isTopDeal" valuePropName="checked" noStyle>
                      <Checkbox className="admin-product-edit__checkbox">{t('form.topDeal')}</Checkbox>
                    </Form.Item>
                  </Col>

                  <Col>
                    <Form.Item name="isFeatured" valuePropName="checked" noStyle>
                      <Checkbox className="admin-product-edit__checkbox">{t('form.featured')}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={<span className="admin-product-edit__label">{t('form.features')}</span>}>
                <Form.List name="features">
                  {(fields, { add, remove }) => (
                    <div className="admin-product-edit__features">
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className="admin-product-edit__feature-row">
                          <Form.Item {...restField} name={name} style={{ flex: 1, marginBottom: 0 }}>
                            <Input className="admin-product-edit__input" placeholder={t('form.featurePlaceholder', { number: name + 1 })} />
                          </Form.Item>

                          <Button danger type="text" className="admin-product-edit__remove-feature-btn" onClick={() => remove(name)}>
                            {t('form.removeFeature')}
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="dashed"
                        className="admin-product-edit__add-feature-btn"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        {t('form.addFeature')}
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="description" label={<span className="admin-product-edit__label">{t('form.shortDescription')}</span>}>
                <div className="admin-product-edit__editor">
                  <TiptapEditor
                    value={description || ''}
                    onChange={value => form.setFieldsValue({ description: value })}
                  />
                </div>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="content" label={<span className="admin-product-edit__label">{t('form.content')}</span>}>
                <div className="admin-product-edit__editor">
                  <TiptapEditor value={content || ''} onChange={value => form.setFieldsValue({ content: value })} />
                </div>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="thumbnail"
                label={<span className="admin-product-edit__label">{t('form.thumbnail')}</span>}
                valuePropName="fileList"
                getValueFromEvent={getFileListFromEvent}
                rules={[{ required: true, message: t('form.thumbnailRequired') }]}
                extra={<span className="admin-product-edit__hint">{t('form.thumbnailHint')}</span>}
              >
                <Upload className="admin-product-edit__upload" listType="picture-card" maxCount={1} accept="image/*" beforeUpload={beforeUploadImage}>
                  <div className="admin-product-edit__upload-trigger">
                    <PlusOutlined />
                    <div className="admin-product-edit__upload-text">{t('form.addImage')}</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="images"
                label={<span className="admin-product-edit__label">{t('form.productImages')}</span>}
                valuePropName="fileList"
                getValueFromEvent={getFileListFromEvent}
                extra={<span className="admin-product-edit__hint">{t('form.productImagesHint')}</span>}
              >
                <Upload
                  className="admin-product-edit__upload"
                  listType="picture-card"
                  multiple
                  maxCount={12}
                  accept="image/*"
                  beforeUpload={beforeUploadImage}
                >
                  <div className="admin-product-edit__upload-trigger">
                    <PlusOutlined />
                    <div className="admin-product-edit__upload-text">{t('form.addImage')}</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <ProductTranslationFields form={form} classNamePrefix="admin-product-edit" />

          <ProductCredentialManager productId={id} enabled={deliveryType === 'instant_account'} />

          <Form.Item className="admin-product-edit__actions">
            <Button className="admin-product-edit__btn admin-product-edit__btn--cancel" onClick={() => navigate(pathNavigate)} disabled={loading}>
              {t('form.cancel')}
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              className="admin-product-edit__btn admin-product-edit__btn--submit"
            >
              {loading ? t('form.saving') : t('form.save')}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </section>
  )
}

export default AdminProductsEdit
