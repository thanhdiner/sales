import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Select, Form, InputNumber } from 'antd'

const { Option } = Select

function AdminProductCategoriesFilter({ onFilter, initialValues }) {
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
        <Form.Item name="categoryName" label={<span className="admin-product-categories-filter-label">Category Name</span>}>
          <Input className="admin-product-categories-input" placeholder="Category Name" />
        </Form.Item>
        <Form.Item className="w-[100px]" name="status" label={<span className="admin-product-categories-filter-label">Status</span>}>
          <Select
            className="admin-product-categories-input"
            popupClassName="admin-product-categories-popup"
            getPopupContainer={trigger => trigger?.parentElement || document.body}
          >
            <Option value="all">All</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>
        <Form.Item name="show" label={<span className="admin-product-categories-filter-label">Show</span>}>
          <Select
            className="admin-product-categories-input"
            popupClassName="admin-product-categories-popup"
            getPopupContainer={trigger => trigger?.parentElement || document.body}
          >
            <Option value="10">10 per page</Option>
            <Option value="20">20 per page</Option>
            <Option value="50">50 per page</Option>
            <Option value="100">100 per page</Option>
          </Select>
        </Form.Item>
        <Form.Item name="position" label={<span className="admin-product-categories-filter-label">Position</span>}>
          <InputNumber className="admin-product-categories-input" placeholder="Position" />
        </Form.Item>
        <Form.Item className="product-categories-filter-actions-item">
          <div className="product-categories-filter-actions">
            <Button type="primary" htmlType="submit" className="admin-product-categories-btn admin-product-categories-btn--apply">
              <SearchOutlined />
              Filter
            </Button>
            <Button className="admin-product-categories-btn admin-product-categories-btn--clear" danger onClick={handleClear}>
              <CloseOutlined />
              Clear
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AdminProductCategoriesFilter
