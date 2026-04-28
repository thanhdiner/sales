import { TableOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'

function DropdownToggleColumns({ columnMenu }) {
  const { t } = useTranslation('adminProducts')

  return (
    <Dropdown dropdownRender={() => columnMenu} trigger={['click']} placement="bottomRight" arrow overlayClassName="admin-products-column-dropdown">
      <Button className="admin-products-btn admin-products-btn--utility">
        <TableOutlined />
        {t('utility.toggleColumns')}
      </Button>
    </Dropdown>
  )
}

export default DropdownToggleColumns
