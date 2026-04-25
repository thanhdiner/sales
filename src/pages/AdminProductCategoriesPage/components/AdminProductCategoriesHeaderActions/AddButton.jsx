import { PlusCircleFilled } from '@ant-design/icons'
import { Button } from 'antd'
import { Link } from 'react-router-dom'

function AddButton() {
  return (
    <Link to="/admin/product-categories/create">
      <Button variant="outlined" className="admin-product-categories-btn admin-product-categories-btn--add font-bold">
        <PlusCircleFilled />
        ADD
      </Button>
    </Link>
  )
}

export default AddButton
