function FieldThumbnail({ thumbnail, record }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img
        src={thumbnail}
        alt={record.title}
        style={{
          width: 36,
          height: 36,
          borderRadius: 6,
          objectFit: 'cover',
          backgroundColor: '#f5f5f5',
          padding: 2,
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
        }}
      />
    </div>
  )
}

export default FieldThumbnail
