import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import { Link } from 'react-router-dom'
import useAdminPermissions from '@/hooks/useAdminPermissions'

function FieldAction({ record, handleDelete }) {
  const permission = useAdminPermissions()

  return (
    <Space size="middle">
      {permission.includes('edit_product') && (
        <Link to={`/admin/products/edit/${record._id}`}>
          <Button className="dark:bg-gray-500  dark:hover:!bg-gray-400" icon={<EditOutlined className="dark:text-gray-300" />} />
        </Link>
      )}
      {permission.includes('delete_product') && (
        <Button
          className="dark:bg-red-500 dark:hover:!bg-red-400"
          icon={<DeleteOutlined className="dark:text-gray-300" />}
          onClick={() => handleDelete(record)}
        />
      )}
    </Space>
  )
}

export default FieldAction
