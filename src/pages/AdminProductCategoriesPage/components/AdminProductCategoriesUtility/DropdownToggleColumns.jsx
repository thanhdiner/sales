import { TableOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'

function DropdownToggleColumns({ columnMenu }) {
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
        Toggle Columns
      </Button>
    </Dropdown>
  )
}

export default DropdownToggleColumns
