import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Select, Form, InputNumber } from 'antd'
import { useTranslation } from 'react-i18next'

const { Option } = Select

function ProductCategoriesFilter({ onFilter, initialValues }) {
  const { t } = useTranslation('adminProductCategories')
  const [form] = Form.useForm()

  //# handler
  const handleSubmit = async values => {
    const cleaned = Object.fromEntries(Object.entries(values).filter(([_, v]) => v !== undefined && v !== '' && v !== 'all'))
    onFilter(cleaned)
  }

  const handleClear = () => {
    form.resetFields()
    onFilter({})
  }

  return (
    <div className="product-categories-filter products-filter">
      <Form
        form={form}
        initialValues={{
          status: 'all',
          show: '10',
          ...initialValues
        }}
        onFinish={handleSubmit}
        layout="vertical"
        className="product-categories-filter-form products-filter-form admin-product-categories-filter-form"
      >
        <Form.Item name="categoryName" label={<span className="admin-product-categories-filter-label">{t('filters.categoryName')}</span>}>
          <Input className="admin-product-categories-input" placeholder={t('filters.categoryNamePlaceholder')} />
        </Form.Item>
        <Form.Item
          className="w-[100px]"
          name="status"
          label={<span className="admin-product-categories-filter-label">{t('filters.status')}</span>}
        >
          <Select
            className="admin-product-categories-input"
            popupClassName="admin-product-categories-popup"
            getPopupContainer={trigger => trigger?.parentElement || document.body}
          >
            <Option value="all">{t('filters.all')}</Option>
            <Option value="active">{t('status.active')}</Option>
            <Option value="inactive">{t('status.inactive')}</Option>
          </Select>
        </Form.Item>
        <Form.Item name="show" label={<span className="admin-product-categories-filter-label">{t('filters.show')}</span>}>
          <Select
            className="admin-product-categories-input"
            popupClassName="admin-product-categories-popup"
            getPopupContainer={trigger => trigger?.parentElement || document.body}
          >
            <Option value="10">{t('filters.perPage', { count: 10 })}</Option>
            <Option value="20">{t('filters.perPage', { count: 20 })}</Option>
            <Option value="50">{t('filters.perPage', { count: 50 })}</Option>
            <Option value="100">{t('filters.perPage', { count: 100 })}</Option>
          </Select>
        </Form.Item>
        <Form.Item name="position" label={<span className="admin-product-categories-filter-label">{t('filters.position')}</span>}>
          <InputNumber className="admin-product-categories-input" placeholder={t('filters.positionPlaceholder')} />
        </Form.Item>
        <Form.Item className="product-categories-filter-actions-item">
          <div className="product-categories-filter-actions">
            <Button type="primary" htmlType="submit" className="admin-product-categories-btn admin-product-categories-btn--apply">
              <SearchOutlined />
              {t('filters.filter')}
            </Button>
            <Button className="admin-product-categories-btn admin-product-categories-btn--clear" danger onClick={handleClear}>
              <CloseOutlined />
              {t('filters.clear')}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ProductCategoriesFilter
