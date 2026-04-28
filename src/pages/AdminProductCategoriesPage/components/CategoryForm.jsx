import { Col, Form, Input, InputNumber, Row, Select, TreeSelect } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminFormActions, AdminRichTextField, AdminUploadField } from '@/components/admin/form'
import { getLocalizedProductCategoryTree } from '../utils/productCategoryLocalization'
import CategoryTranslationFields from './CategoryTranslationFields'

const CATEGORY_FORM_INITIAL_VALUES = {
  status: 'active'
}

const labelClassName = 'text-[var(--admin-text-muted)]'
const inputClassName =
  '!border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'
const secondaryButtonClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
const primaryButtonClass = 'rounded-lg !border-none !bg-[var(--admin-accent)] !text-white hover:!opacity-90'

export default function CategoryForm({
  beforeUploadImage,
  form,
  getFileListFromEvent,
  loading,
  mode,
  onCancel,
  onSubmit,
  treeData
}) {
  const { t, i18n } = useTranslation('adminProductCategories')
  const isCreate = mode === 'create'
  const language = i18n.resolvedLanguage || i18n.language
  const localizedTreeData = useMemo(() => getLocalizedProductCategoryTree(treeData, language), [language, treeData])
  const label = key => <span className={labelClassName}>{t(key)}</span>

  return (
    <Form
      className="admin-product-categories-form"
      form={form}
      initialValues={isCreate ? CATEGORY_FORM_INITIAL_VALUES : undefined}
      layout="vertical"
      onFinish={onSubmit}
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item name="title" label={label('form.categoryName')} rules={[{ required: true }]}>
            <Input className={inputClassName} placeholder={t('form.categoryNamePlaceholder')} />
          </Form.Item>

          <Form.Item name="parent_id" label={label('form.parentCategory')}>
            <TreeSelect
              allowClear
              className="admin-product-categories-input"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              filterTreeNode={(input, treeNode) => String(treeNode.title || '').toLowerCase().includes(input.toLowerCase())}
              getPopupContainer={trigger => trigger?.parentElement || document.body}
              placeholder={t('form.parentCategoryPlaceholder')}
              popupClassName="admin-product-categories-popup"
              showSearch
              style={{ width: '100%' }}
              treeData={localizedTreeData}
              treeDefaultExpandAll
            />
          </Form.Item>

          <Form.Item name="slug" label={label('form.slug')}>
            <Input className={inputClassName} placeholder={t('form.slugPlaceholder')} />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="status" label={label('form.status')}>
            <Select
              className="admin-product-categories-input"
              getPopupContainer={trigger => trigger?.parentElement || document.body}
              options={[
                { label: t('status.active'), value: 'active' },
                { label: t('status.inactive'), value: 'inactive' }
              ]}
              popupClassName="admin-product-categories-popup"
            />
          </Form.Item>

          <Form.Item name="position" label={label('form.position')}>
            <InputNumber
              className="admin-product-categories-input"
              min={0}
              placeholder={t('form.positionPlaceholder')}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col span={24}>
          <AdminRichTextField
            form={form}
            label={label('form.shortDescription')}
            name="description"
          />
        </Col>

        <Col span={24}>
          <AdminRichTextField
            form={form}
            label={label('form.content')}
            name="content"
          />
        </Col>

        <Col span={24}>
          <CategoryTranslationFields form={form} />
        </Col>

        <Col span={24}>
          <AdminUploadField
            addLabel={t('form.addImage')}
            beforeUpload={beforeUploadImage}
            getValueFromEvent={getFileListFromEvent}
            label={label('form.thumbnail')}
            maxCount={1}
            name="thumbnail"
            rules={[{ required: true, message: t('form.thumbnailRequired') }]}
            triggerTextClassName="mt-2 text-[var(--admin-text-muted)]"
          />
        </Col>
      </Row>

      <AdminFormActions
        cancelButtonClassName={secondaryButtonClass}
        cancelLabel={t('form.cancel')}
        containerClassName="admin-product-categories-form-actions"
        formItemClassName="admin-product-categories-form-actions-item"
        loading={loading}
        onCancel={onCancel}
        submitButtonClassName={primaryButtonClass}
        submitLabel={isCreate ? t('form.create') : t('form.save')}
        submittingLabel={isCreate ? t('form.creating') : t('form.saving')}
      />
    </Form>
  )
}
