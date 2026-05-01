import { PlusCircleFilled } from '@ant-design/icons'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function AddButton() {
  const { t } = useTranslation('adminProductCategories')

  return (
    <Link to="/admin/product-categories/create">
      <Button variant="outlined" className="admin-product-categories-btn admin-product-categories-btn--add font-bold">
        <PlusCircleFilled />
        {t('bulk.add')}
      </Button>
    </Link>
  )
}

export default AddButton
