import { Modal, Select, Input, DatePicker, InputNumber } from 'antd'

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
          <span className="dark:text-white">Chỉnh Sửa Flash Sale</span>
        ) : (
          <span className="dark:text-white">Tạo Flash Sale Mới</span>
        )
      }
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={submitLoading}
      destroyOnClose
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
            Tên chương trình <span className="text-red-500">*</span>
          </label>
          <Input
            required
            value={formData.name}
            onChange={e => onChange('name', e.target.value)}
            placeholder="Nhập tên chương trình flash sale"
            className="dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
              Ngày & giờ bắt đầu <span className="text-red-500">*</span>
            </label>
            <DatePicker
              showTime
              value={formData.startAt}
              onChange={value => onChange('startAt', value)}
              className="w-full dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              format="YYYY-MM-DD HH:mm"
              placeholder="Ngày bắt đầu"
              getPopupContainer={trigger => trigger.parentNode}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
              Ngày & giờ kết thúc <span className="text-red-500">*</span>
            </label>
            <DatePicker
              showTime
              value={formData.endAt}
              onChange={value => onChange('endAt', value)}
              className="w-full dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              format="YYYY-MM-DD HH:mm"
              placeholder="Ngày kết thúc"
              getPopupContainer={trigger => trigger.parentNode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
              Phần trăm giảm giá (%) <span className="text-red-500">*</span>
            </label>
            <InputNumber
              required
              min={1}
              max={90}
              value={formData.discountPercent}
              onChange={value => onChange('discountPercent', value)}
              className="w-full"
              placeholder="Nhập % giảm giá"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
              Số lượng tối đa <span className="text-red-500">*</span>
            </label>
            <InputNumber
              required
              min={1}
              value={formData.maxQuantity}
              onChange={value => onChange('maxQuantity', value)}
              className="w-full"
              placeholder="Nhập số lượng"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
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
            className="w-full"
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
