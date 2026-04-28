import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, InputNumber, Row, Select, TreeSelect, Upload } from 'antd'
import { useMemo } from 'react'
import TiptapEditor from '@/components/TiptapEditor'
import { useAdminProductCategoryCreate } from '../hooks/useAdminProductCategoryCreate'
import CategoryTranslationFields from '../components/CategoryTranslationFields'
import { getLocalizedProductCategoryTree } from '../utils/productCategoryLocalization'
import { useTranslation } from 'react-i18next'
import '../AdminProductCategoriesPage.scss'

const initialValues = {
  status: 'active'
}
const labelClassName = 'text-[var(--admin-text-muted)]'
const inputClassName =
  '!border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'
const secondaryButtonClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
const primaryButtonClass = 'rounded-lg !border-none !bg-[var(--admin-accent)] !text-white hover:!opacity-90'

const AdminProductCategoriesCreate = () => {
  const { t, i18n } = useTranslation('adminProductCategories')
  const { form, loading, treeData, handleSubmit, beforeUploadImage, getFileListFromEvent, navigate } =
    useAdminProductCategoryCreate()
  const language = i18n.resolvedLanguage || i18n.language
  const localizedTreeData = useMemo(() => getLocalizedProductCategoryTree(treeData, language), [language, treeData])
  const description = Form.useWatch('description', form)
  const content = Form.useWatch('content', form)

  return (
    <Form className="admin-product-categories-form" form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item name="title" label={<span className={labelClassName}>{t('form.categoryName')}</span>} rules={[{ required: true }]}>
            <Input className={inputClassName} placeholder={t('form.categoryNamePlaceholder')} />
          </Form.Item>
          <Form.Item name="parent_id" label={<span className={labelClassName}>{t('form.parentCategory')}</span>}>
            <TreeSelect
              style={{ width: '100%' }}
              className="admin-product-categories-input"
              popupClassName="admin-product-categories-popup"
              getPopupContainer={trigger => trigger?.parentElement || document.body}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={localizedTreeData}
              placeholder={t('form.parentCategoryPlaceholder')}
              treeDefaultExpandAll
              allowClear
              showSearch
              filterTreeNode={(input, treeNode) => String(treeNode.title || '').toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>
          <Form.Item name="slug" label={<span className={labelClassName}>{t('form.slug')}</span>}>
            <Input className={inputClassName} placeholder={t('form.slugPlaceholder')} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="status" label={<span className={labelClassName}>{t('form.status')}</span>}>
            <Select
              className="admin-product-categories-input"
              popupClassName="admin-product-categories-popup"
              getPopupContainer={trigger => trigger?.parentElement || document.body}
              options={[
                { label: t('status.active'), value: 'active' },
                { label: t('status.inactive'), value: 'inactive' }
              ]}
            />
          </Form.Item>
          <Form.Item name="position" label={<span className={labelClassName}>{t('form.position')}</span>}>
            <InputNumber className="admin-product-categories-input" placeholder={t('form.positionPlaceholder')} style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 0]}>
        <Col span={24}>
          <Form.Item name="description" label={<span className={labelClassName}>{t('form.shortDescription')}</span>}>
            <TiptapEditor value={description || ''} onChange={value => form.setFieldValue('description', value)} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="content" label={<span className={labelClassName}>{t('form.content')}</span>}>
            <TiptapEditor value={content || ''} onChange={value => form.setFieldValue('content', value)} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <CategoryTranslationFields form={form} />
        </Col>
        <Col span={24}>
          <Form.Item
            name="thumbnail"
            label={<span className={labelClassName}>{t('form.thumbnail')}</span>}
            valuePropName="fileList"
            getValueFromEvent={getFileListFromEvent}
            rules={[{ required: true, message: t('form.thumbnailRequired') }]}
          >
            <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={beforeUploadImage}>
              <div>
                <PlusOutlined />
                <div className="mt-2 text-[var(--admin-text-muted)]">{t('form.addImage')}</div>
              </div>
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item className="admin-product-categories-form-actions-item">
        <div className="admin-product-categories-form-actions">
          <Button className={secondaryButtonClass} onClick={() => navigate('/admin/product-categories')} disabled={loading}>
            {t('form.cancel')}
          </Button>
          <Button className={primaryButtonClass} type="primary" htmlType="submit" loading={loading} disabled={loading}>
            {loading ? t('form.creating') : t('form.create')}
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}

export default AdminProductCategoriesCreate
