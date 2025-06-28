function FieldThumbnail({ thumbnail, record }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img
        src={thumbnail}
        alt={record.productName}
        style={{
          padding: 3,
          width: 50,
          height: 30,
          objectFit: 'cover',
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}
      />
    </div>
  )
}

export default FieldThumbnail
