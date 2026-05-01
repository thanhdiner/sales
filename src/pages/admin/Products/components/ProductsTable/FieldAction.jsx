import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import { Link } from 'react-router-dom'
import usePermissions from '@/hooks/admin/useAdminPermissions'
import { useTranslation } from 'react-i18next'

function FieldAction({ record, handleDelete }) {
  const { t } = useTranslation('adminProducts')
  const permission = usePermissions()

  return (
    <Space size="middle">
      {permission.includes('edit_product') && (
        <Link to={`/admin/products/edit/${record._id}`}>
          <Button
            className="admin-products-action-btn admin-products-action-btn--edit"
            icon={<EditOutlined />}
            title={t('common.edit')}
            aria-label={t('common.edit')}
          />
        </Link>
      )}
      {permission.includes('delete_product') && (
        <Button
          className="admin-products-action-btn admin-products-action-btn--delete"
          icon={<DeleteOutlined />}
          title={t('common.delete')}
          aria-label={t('common.delete')}
          onClick={() => handleDelete(record)}
        />
      )}
    </Space>
  )
}

export default FieldAction
