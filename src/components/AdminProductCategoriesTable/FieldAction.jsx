import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import { Link } from 'react-router-dom'
import useAdminPermissions from '../../hooks/useAdminPermissions'

function FieldAction({ record, handleDelete }) {
  const permissions = useAdminPermissions()

  return (
    <Space size="middle">
      {permissions.includes('edit_product_category') && (
        <Link to={`/admin/product-categories/edit/${record._id}`}>
          <Button className="dark:bg-gray-500  dark:hover:!bg-gray-400" icon={<EditOutlined className="dark:text-gray-300" />} />
        </Link>
      )}
      {permissions.includes('delete_product_category') && (
        <Button
          className="dark:bg-red-500 dark:hover:!bg-red-400"
          color="danger"
          variant="outlined"
          icon={<DeleteOutlined className="dark:text-gray-300" />}
          onClick={() => handleDelete(record)}
        />
      )}
    </Space>
  )
}

export default FieldAction
