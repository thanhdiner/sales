import { extractFileName } from '@/utils/extractFileName'

function ProductCategoryThumbnail({ thumbnail, title }) {
  return (
    <div className="admin-product-thumb-card">
      <div className="admin-product-thumb-card__image-wrapper">
        <img className="admin-product-thumb-card__image" src={thumbnail} alt={title} />
      </div>
      <p className="admin-product-thumb-card__filename">{extractFileName(thumbnail)}</p>
    </div>
  )
}

export default ProductCategoryThumbnail
