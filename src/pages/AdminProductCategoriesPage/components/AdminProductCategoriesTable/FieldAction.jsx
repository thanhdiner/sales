import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import { Link } from 'react-router-dom'
import useAdminPermissions from '@/hooks/useAdminPermissions'

function FieldAction({ record, handleDelete }) {
  const permissions = useAdminPermissions()

  return (
    <Space size="middle">
      {permissions.includes('edit_product_category') && (
        <Link to={`/admin/product-categories/edit/${record._id}`}>
          <Button className="admin-product-categories-action-btn" icon={<EditOutlined />} />
        </Link>
      )}
      {permissions.includes('delete_product_category') && (
        <Button
          className="admin-product-categories-action-btn admin-product-categories-action-btn--delete"
          color="danger"
          variant="outlined"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record)}
        />
      )}
    </Space>
  )
}

export default FieldAction
