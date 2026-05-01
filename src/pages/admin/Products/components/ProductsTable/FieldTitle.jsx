import { Link } from 'react-router-dom'

function FieldTitle({ productName, record }) {
  return (
    <Link to={`/admin/products/details/${record._id}`} target="_blank" className="admin-products-title-link">
      {productName}
    </Link>
  )
}

export default FieldTitle
