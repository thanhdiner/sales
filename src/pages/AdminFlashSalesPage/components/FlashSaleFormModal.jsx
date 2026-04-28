import { Modal, Select, Input, DatePicker, InputNumber } from 'antd'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { getLocalizedProductTitle } from '../utils/flashSaleHelpers'

const secondaryButtonClass =
  '!border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
const primaryButtonClass =
  '!border-none !bg-[var(--admin-accent)] !text-white hover:!opacity-90'

export default function FlashSaleFormModal({
  open,
  editingItem,
  formData,
  productList,
  productLoading,
  submitLoading,
  onCancel,
  onSubmit,
  onChange,
  onSearchProduct
}) {
  const { t, i18n } = useTranslation('adminFlashSales')
  const language = useSelector(state => state.language?.value || i18n.resolvedLanguage || i18n.language)
  const productOptions = productList.map(product => ({
    value: product._id,
    label: getLocalizedProductTitle(product, language, product.title || t('form.fields.products.loading'))
  }))

  return (
    <Modal
      title={
        editingItem ? (
          <span className="text-[var(--admin-text)]">{t('form.editTitle')}</span>
        ) : (
          <span className="text-[var(--admin-text)]">{t('form.createTitle')}</span>
        )
      }
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={submitLoading}
      className="admin-flash-sales-modal"
      rootClassName="admin-flash-sales-modal"
      wrapClassName="admin-flash-sales-modal"
      okText={editingItem ? t('actions.updateSubmit') : t('actions.createSubmit')}
      cancelText={t('actions.cancel')}
      okButtonProps={{ className: primaryButtonClass }}
      cancelButtonProps={{ className: secondaryButtonClass }}
      destroyOnClose
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--admin-text-muted)]">
            {t('form.fields.name.label')} <span className="text-red-500">*</span>
          </label>
          <Input
            required
            value={formData.name}
            onChange={e => onChange('name', e.target.value)}
            placeholder={t('form.fields.name.placeholder')}
            className="!border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]"
          />
        </div>

        <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-3">
          <div className="mb-3">
            <p className="text-sm font-semibold text-[var(--admin-text)]">{t('form.translations.sectionTitle')}</p>
            <p className="text-xs text-[var(--admin-text-muted)]">{t('form.translations.sectionDescription')}</p>
          </div>

          <label className="mb-1 block text-sm font-medium text-[var(--admin-text-muted)]">
            {t('form.translations.name.label')}
          </label>
          <Input
            value={formData.translations?.en?.name || ''}
            onChange={e => onChange(['translations', 'en', 'name'], e.target.value)}
            placeholder={t('form.translations.name.placeholder')}
            className="!border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-muted)]">
              {t('form.fields.startAt.label')} <span className="text-red-500">*</span>
            </label>
            <DatePicker
              showTime
              value={formData.startAt}
              onChange={value => onChange('startAt', value)}
              className="w-full !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]"
              format="YYYY-MM-DD HH:mm"
              placeholder={t('form.fields.startAt.placeholder')}
              getPopupContainer={trigger => trigger.parentNode}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-muted)]">
              {t('form.fields.endAt.label')} <span className="text-red-500">*</span>
            </label>
            <DatePicker
              showTime
              value={formData.endAt}
              onChange={value => onChange('endAt', value)}
              className="w-full !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]"
              format="YYYY-MM-DD HH:mm"
              placeholder={t('form.fields.endAt.placeholder')}
              getPopupContainer={trigger => trigger.parentNode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-muted)]">
              {t('form.fields.discountPercent.label')} <span className="text-red-500">*</span>
            </label>
            <InputNumber
              required
              min={1}
              max={90}
              value={formData.discountPercent}
              onChange={value => onChange('discountPercent', value)}
              className="w-full !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]"
              placeholder={t('form.fields.discountPercent.placeholder')}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-muted)]">
              {t('form.fields.maxQuantity.label')} <span className="text-red-500">*</span>
            </label>
            <InputNumber
              required
              min={1}
              value={formData.maxQuantity}
              onChange={value => onChange('maxQuantity', value)}
              className="w-full !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]"
              placeholder={t('form.fields.maxQuantity.placeholder')}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--admin-text-muted)]">
            {t('form.fields.products.label')} <span className="text-red-500">*</span>
          </label>
          <Select
            mode="multiple"
            allowClear
            showSearch
            onSearch={onSearchProduct}
            filterOption={false}
            placeholder={t('form.fields.products.placeholder')}
            value={formData.products}
            onChange={value => onChange('products', value)}
            className="w-full !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]"
            optionFilterProp="label"
            getPopupContainer={trigger => trigger.parentNode}
            loading={productLoading}
            options={productOptions}
          />
        </div>
      </div>
    </Modal>
  )
}

