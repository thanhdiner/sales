import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import { Link } from 'react-router-dom'

function FieldAction({ record, handleDelete }) {
  return (
    <Space size="middle">
      <Link to={`/admin/products/edit/${record._id}`}>
        <Button icon={<EditOutlined />} />
      </Link>
      <Button color="danger" variant="outlined" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
    </Space>
  )
}

export default FieldAction
