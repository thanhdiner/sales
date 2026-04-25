import { Link } from 'react-router-dom'

function FieldTitle({ categoryName, record }) {
  return (
    <Link to={`/admin/product-categories/${record._id}`} target="_blank" className="admin-product-categories-title-link">
      {categoryName}
    </Link>
  )
}

export default FieldTitle
