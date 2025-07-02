import { TableOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'

function DropdownToggleColumns({ columnMenu }) {
  return (
    <Dropdown dropdownRender={() => columnMenu} trigger={['click']} placement="bottomRight" arrow>
      <Button className="custom-btn-orange">
        <TableOutlined />
        Toggle Columns
      </Button>
    </Dropdown>
  )
}

export default DropdownToggleColumns
