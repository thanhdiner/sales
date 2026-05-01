import { PlusCircleFilled } from '@ant-design/icons'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function AddButton() {
  const { t } = useTranslation('adminProducts')

  return (
    <Link to="/admin/products/create">
      <Button className="admin-products-btn admin-products-btn--add font-bold" variant="outlined">
        <PlusCircleFilled />
        {t('bulk.add')}
      </Button>
    </Link>
  )
}

export default AddButton
