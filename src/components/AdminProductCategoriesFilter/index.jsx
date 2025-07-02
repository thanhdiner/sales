import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Select, Form } from 'antd'

const { Option } = Select

function AdminProductCategoriesFilter({ onFilter }) {
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
    <div className="product-categories-filter">
      <Form
        form={form}
        initialValues={{
          status: 'all',
          show: '10'
        }}
        onFinish={handleSubmit}
        layout="vertical"
        className="product-categories-filter-form"
      >
        <Form.Item name="categoryName" label="Category Name">
          <Input placeholder="Category Name" />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select>
            <Option value="all">All</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>
        <Form.Item name="show" label="Show">
          <Select>
            <Option value="10">10 per page</Option>
            <Option value="20">20 per page</Option>
            <Option value="50">50 per page</Option>
            <Option value="100">100 per page</Option>
          </Select>
        </Form.Item>
        <Form.Item name="position" label="Position">
          <Input placeholder="Position" />
        </Form.Item>
        <Form.Item>
          <div className="product-category-filter">
            <Button type="primary" htmlType="submit">
              <SearchOutlined />
              Filter
            </Button>
            <Button danger onClick={handleClear}>
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
