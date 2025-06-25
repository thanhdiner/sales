import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, Select, Form } from 'antd'

const { Option } = Select

function AdminProductsFilter() {
  const [form] = Form.useForm()

  const onFilter = values => {
    console.log('Filter applied with values:', values)
    // Thêm logic lọc dữ liệu tại đây
  }
  return (
    <>
      <div className="products-filter">
        <Form form={form} onFinish={onFilter} layout="inline">
          <Form.Item name="productName" label="Product Name">
            <Input placeholder="Product Name" />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <Input placeholder="Price" />
          </Form.Item>
          <Form.Item name="model" label="Model">
            <Input placeholder="Model" />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity">
            <Input placeholder="Quantity" />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select defaultValue="all" style={{ width: 120 }}>
              <Option value="all">All</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item name="show" label="Show">
            <Select defaultValue="10" style={{ width: 120 }}>
              <Option value="10">10 per page</Option>
              <Option value="20">20 per page</Option>
              <Option value="50">50 per page</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              <SearchOutlined />
              Filter
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default AdminProductsFilter
