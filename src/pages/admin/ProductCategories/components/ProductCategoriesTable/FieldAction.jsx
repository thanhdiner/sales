import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import { Link } from 'react-router-dom'
import useAdminPermissions from '@/hooks/admin/useAdminPermissions'
import { useTranslation } from 'react-i18next'

function FieldAction({ record, handleDelete }) {
  const { t } = useTranslation('adminProductCategories')
  const permissions = useAdminPermissions()

  return (
    <Space size="middle">
      {permissions.includes('edit_product_category') && (
        <Link to={`/admin/product-categories/edit/${record._id}`}>
          <Button className="admin-product-categories-action-btn" icon={<EditOutlined />} aria-label={t('common.edit')} title={t('common.edit')} />
        </Link>
      )}
      {permissions.includes('delete_product_category') && (
        <Button
          className="admin-product-categories-action-btn admin-product-categories-action-btn--delete"
          color="danger"
          variant="outlined"
          icon={<DeleteOutlined />}
          aria-label={t('common.delete')}
          title={t('common.delete')}
          onClick={() => handleDelete(record)}
        />
      )}
    </Space>
  )
}

export default FieldAction
