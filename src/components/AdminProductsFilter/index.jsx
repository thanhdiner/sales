import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Select, Form, message, TreeSelect, InputNumber } from 'antd'
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
    <div className="products-filter dark:bg-gray-700">
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
        <Form.Item name="productName" label={<span className="dark:text-gray-300">Product Name</span>}>
          <Input
            placeholder="Product Name"
            className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
          />
        </Form.Item>
        <Form.Item name="price" label={<span className="dark:text-gray-300">Price</span>}>
          <InputNumber min={0} step={1000} className="w-full dark:bg-gray-800 dark:border-gray-600" placeholder="Price" />
        </Form.Item>
        <Form.Item name="product_category" label={<span className="dark:text-gray-300">Product Category</span>}>
          <TreeSelect treeData={treeData} placeholder="Select category" allowClear treeDefaultExpandAll />
        </Form.Item>
        <Form.Item name="stock" label={<span className="dark:text-gray-300">Stock</span>}>
          <InputNumber min={0} className="w-full dark:bg-gray-800 dark:border-gray-600" placeholder="Stock" />
        </Form.Item>
        <Form.Item name="status" label={<span className="dark:text-gray-300">Status</span>}>
          <Select>
            <Option value="all">All</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>
        <Form.Item name="show" label={<span className="dark:text-gray-300">Show</span>}>
          <Select>
            <Option value="10">10 per page</Option>
            <Option value="20">20 per page</Option>
            <Option value="50">50 per page</Option>
            <Option value="100">100 per page</Option>
          </Select>
        </Form.Item>
        <Form.Item name="position" label={<span className="dark:text-gray-300">Position</span>}>
          <InputNumber placeholder="Position" className="w-full dark:bg-gray-800 dark:border-gray-600" />
        </Form.Item>
        <Form.Item name="discountPercentage" label={<span className="dark:text-gray-300">Discount (%)</span>}>
          <InputNumber className="w-full dark:bg-gray-800 dark:border-gray-600" min={0} max={100} placeholder="Discount %" />
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
