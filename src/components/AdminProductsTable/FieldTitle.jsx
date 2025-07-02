import { Link } from 'react-router-dom'

function FieldTitle({ productName, record }) {
  return (
    <Link to={`/admin/products/details/${record._id}`} target="_blank">
      {productName}
    </Link>
  )
}

export default FieldTitle
