function FieldThumbnail({ thumbnail, record }) {
  return (
    <div className="admin-products-thumbnail-wrap">
      <img src={thumbnail} alt={record.title} className="admin-products-thumbnail" />
    </div>
  )
}

export default FieldThumbnail
