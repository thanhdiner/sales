import { PlusCircleFilled } from '@ant-design/icons'
import { Button } from 'antd'
import { Link } from 'react-router-dom'

function ResourceAddButton({ buttonClassName, label, to }) {
  return (
    <Link to={to}>
      <Button className={buttonClassName} variant="outlined">
        <PlusCircleFilled />
        {label}
      </Button>
    </Link>
  )
}

export default ResourceAddButton
