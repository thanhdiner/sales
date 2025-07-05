import { extractFileName } from '../../../utils/extractFileName'
import './AdminProductCategoryThumbnail.scss'

function ProductCategoryThumbnail({ thumbnail, title }) {
  return (
    <>
      <div className="product-category-thumbnail">
        <div className="product-category-thumbnail__image-wrapper">
          <img className="product-category-thumbnail__image" src={thumbnail} alt={title} />
        </div>
        <p className="product-category-thumbnail__filename">{extractFileName(thumbnail)}</p>
      </div>
    </>
  )
}

export default ProductCategoryThumbnail
