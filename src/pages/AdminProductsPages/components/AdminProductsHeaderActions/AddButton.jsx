import { PlusCircleFilled } from '@ant-design/icons'
import { Button } from 'antd'
import { Link } from 'react-router-dom'

function AddButton() {
  return (
    <Link to="/admin/products/create">
      <Button className="admin-products-btn admin-products-btn--add font-bold" variant="outlined">
        <PlusCircleFilled />
        ADD
      </Button>
    </Link>
  )
}

export default AddButton
