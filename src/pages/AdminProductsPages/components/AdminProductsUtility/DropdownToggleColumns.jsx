import { TableOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'

function DropdownToggleColumns({ columnMenu }) {
  return (
    <Dropdown dropdownRender={() => columnMenu} trigger={['click']} placement="bottomRight" arrow overlayClassName="admin-products-column-dropdown">
      <Button className="admin-products-btn admin-products-btn--utility">
        <TableOutlined />
        Toggle Columns
      </Button>
    </Dropdown>
  )
}

export default DropdownToggleColumns
