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
          <Button className="admin-products-action-btn admin-products-action-btn--edit" icon={<EditOutlined />} />
        </Link>
      )}
      {permission.includes('delete_product') && (
        <Button className="admin-products-action-btn admin-products-action-btn--delete" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
      )}
    </Space>
  )
}

export default FieldAction
