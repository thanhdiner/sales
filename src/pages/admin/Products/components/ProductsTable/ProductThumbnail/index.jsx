import { Image } from 'antd'
import { extractFileName } from '@/utils/extractFileName'
import './index.scss'

function ProductThumbnail({ thumbnail, title }) {
  return (
    <div className="product-thumbnail">
      <div className="product-thumbnail__image-wrapper">
        <Image className="product-thumbnail__image" src={thumbnail} alt={title} />
      </div>
      <p className="product-thumbnail__filename">{extractFileName(thumbnail)}</p>
    </div>
  )
}

export default ProductThumbnail
