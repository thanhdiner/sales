function FieldThumbnail({ thumbnail, record }) {
  return (
    <div className="admin-product-categories-thumbnail-wrap">
      <img
        src={thumbnail}
        alt={record.title}
        className="admin-product-categories-thumbnail"
      />
    </div>
  )
}

export default FieldThumbnail
