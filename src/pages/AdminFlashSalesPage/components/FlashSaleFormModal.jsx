import { Modal, Select, Input, DatePicker, InputNumber } from 'antd'

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
  const productOptions = productList.map(product => ({
    value: product._id,
    label: product.title
  }))

  return (
    <Modal
      title={
        editingItem ? (
          <span className="text-[var(--admin-text)]">Chỉnh Sửa Flash Sale</span>
        ) : (
          <span className="text-[var(--admin-text)]">Tạo Flash Sale Mới</span>
        )
      }
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={submitLoading}
      className="admin-flash-sales-modal"
      rootClassName="admin-flash-sales-modal"
      wrapClassName="admin-flash-sales-modal"
      okButtonProps={{ className: primaryButtonClass }}
      cancelButtonProps={{ className: secondaryButtonClass }}
      destroyOnClose
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--admin-text-muted)]">
            Tên chương trình <span className="text-red-500">*</span>
          </label>
          <Input
            required
            value={formData.name}
            onChange={e => onChange('name', e.target.value)}
            placeholder="Nhập tên chương trình flash sale"
            className="!border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-muted)]">
              Ngày & giờ bắt đầu <span className="text-red-500">*</span>
            </label>
            <DatePicker
              showTime
              value={formData.startAt}
              onChange={value => onChange('startAt', value)}
              className="w-full !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]"
              format="YYYY-MM-DD HH:mm"
              placeholder="Ngày bắt đầu"
              getPopupContainer={trigger => trigger.parentNode}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-muted)]">
              Ngày & giờ kết thúc <span className="text-red-500">*</span>
            </label>
            <DatePicker
              showTime
              value={formData.endAt}
              onChange={value => onChange('endAt', value)}
              className="w-full !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]"
              format="YYYY-MM-DD HH:mm"
              placeholder="Ngày kết thúc"
              getPopupContainer={trigger => trigger.parentNode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-muted)]">
              Phần trăm giảm giá (%) <span className="text-red-500">*</span>
            </label>
            <InputNumber
              required
              min={1}
              max={90}
              value={formData.discountPercent}
              onChange={value => onChange('discountPercent', value)}
              className="w-full !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]"
              placeholder="Nhập % giảm giá"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-muted)]">
              Số lượng tối đa <span className="text-red-500">*</span>
            </label>
            <InputNumber
              required
              min={1}
              value={formData.maxQuantity}
              onChange={value => onChange('maxQuantity', value)}
              className="w-full !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]"
              placeholder="Nhập số lượng"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--admin-text-muted)]">
            Sản phẩm áp dụng <span className="text-red-500">*</span>
          </label>
          <Select
            mode="multiple"
            allowClear
            showSearch
            onSearch={onSearchProduct}
            filterOption={false}
            placeholder="Chọn sản phẩm áp dụng"
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

