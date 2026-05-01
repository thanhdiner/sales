import { TableOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'

function DropdownToggleColumns({ columnMenu, label }) {
  return (
    <Dropdown
      dropdownRender={() => columnMenu}
      trigger={['click']}
      placement="bottomRight"
      arrow
      overlayClassName="admin-product-categories-column-dropdown"
      getPopupContainer={trigger => trigger?.parentElement || document.body}
    >
      <Button className="admin-product-categories-btn">
        <TableOutlined />
        {label}
      </Button>
    </Dropdown>
  )
}

export default DropdownToggleColumns
