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
    <div className="bg-gray-100 dark:bg-gray-800 w-full mt-2.5">
      <Form
        form={form}
        initialValues={{
          status: 'all',
          show: '10',
          ...initialValues
        }}
        onFinish={handleSubmit}
        layout="vertical"
        className="flex flex-wrap gap-x-[15px] p-[15px_20px_0]"
      >
        <Form.Item name="categoryName" label={<span className="dark:text-gray-300">Category Name</span>}>
          <Input
            className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:placeholder:text-gray-400"
            placeholder="Category Name"
          />
        </Form.Item>
        <Form.Item className="w-[100px]" name="status" label={<span className="dark:text-gray-300">Status</span>}>
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
          <InputNumber
            className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:placeholder:text-gray-400"
            placeholder="Position"
          />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end gap-x-2.5">
            <Button type="primary" htmlType="submit">
              <SearchOutlined />
              Filter
            </Button>
            <Button className="dark:bg-transparent dark:text-red-400" danger onClick={handleClear}>
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
