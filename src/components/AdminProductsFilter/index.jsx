import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Select, Form, message, TreeSelect } from 'antd'
import { useEffect, useState } from 'react'
import { getAdminProductCategoryTree } from '../../services/productCategoryService'

const { Option } = Select

function AdminProductsFilter({ onFilter }) {
  const [form] = Form.useForm()
  const [treeData, setTreeData] = useState([])

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const response = await getAdminProductCategoryTree()
        if (response) setTreeData(response)
      } catch (error) {
        message.error('❌ Failed to load category tree data')
      }
    }

    fetchTreeData()
  }, [])
  console.log(treeData)

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
    <div className="products-filter">
      <Form
        form={form}
        initialValues={{
          status: 'all',
          show: '10'
        }}
        onFinish={handleSubmit}
        layout="vertical"
        className="products-filter-form"
      >
        <Form.Item name="productName" label="Product Name">
          <Input placeholder="Product Name" />
        </Form.Item>
        <Form.Item name="price" label="Price">
          <Input placeholder="Price" />
        </Form.Item>
        <Form.Item name="product_category" label="Product Category">
          <TreeSelect treeData={treeData} placeholder="Select category" allowClear treeDefaultExpandAll />
        </Form.Item>
        <Form.Item name="stock" label="Stock">
          <Input placeholder="Stock" />
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
        <Form.Item name="discountPercentage" label="Discount (%)">
          <Input placeholder="Discount %" />
        </Form.Item>
        <Form.Item>
          <div className="product-filter">
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

export default AdminProductsFilter
