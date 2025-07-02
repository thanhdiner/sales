import { PlusCircleFilled } from '@ant-design/icons'
import { Button } from 'antd'
import { Link } from 'react-router-dom'

function AddButton() {
  return (
    <Link to="/admin/product-categories/create">
      <Button style={{ fontWeight: '700' }} variant="outlined" className="custom-btn-blue">
        <PlusCircleFilled />
        ADD
      </Button>
    </Link>
  )
}

export default AddButton
