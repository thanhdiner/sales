import { Link } from 'react-router-dom'

function FieldTitle({ categoryName, record }) {
  return (
    <Link to={`/admin/product-categories/details/${record._id}`} target="_blank">
      {categoryName}
    </Link>
  )
}

export default FieldTitle
