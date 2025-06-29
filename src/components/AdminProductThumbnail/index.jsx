import { extractFileName } from '../../utils/extractFileName'

function ProductThumbnail({ thumbnail, title }) {
  return (
    <>
      <img
        src={thumbnail}
        alt={title}
        style={{
          maxWidth: '100%',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '0.5rem'
        }}
      />
      <div style={{ fontSize: '0.9rem', color: '#555' }}>
        <strong>{extractFileName(thumbnail)}</strong>
      </div>
    </>
  )
}

export default ProductThumbnail
