import { Link } from 'react-router-dom'

function FieldTitle({ productName, record }) {
  return (
    <Link href={`/admin/products&categories/products/details/${record.slug}`} target="_blank">
      {productName}
    </Link>
  )
}

export default FieldTitle
