import { FileImageOutlined, PictureOutlined } from '@ant-design/icons'
import { extractFileName } from '@/utils/extractFileName'

function ProductCategoryThumbnail({ thumbnail, title }) {
  return (
    <section className="admin-product-category-thumb">
      <div className="admin-product-category-thumb__head">
        <div className="admin-product-category-thumb__icon">
          <PictureOutlined />
        </div>

        <div>
          <h2 className="admin-product-category-thumb__title">Ảnh đại diện danh mục</h2>
          <p className="admin-product-category-thumb__description">Xem nhanh ảnh đang dùng cho danh mục này.</p>
        </div>
      </div>

      <div className="admin-product-category-thumb__body">
        {thumbnail ? (
          <>
            <div className="admin-product-category-thumb__image-frame">
              <img className="admin-product-category-thumb__image" src={thumbnail} alt={title || 'Product category thumbnail'} />
            </div>

            <div className="admin-product-category-thumb__meta">
              <div className="admin-product-category-thumb__meta-row">
                <div className="admin-product-category-thumb__meta-icon">
                  <FileImageOutlined />
                </div>

                <div>
                  <p className="admin-product-category-thumb__meta-label">Tên file</p>
                  <p className="admin-product-category-thumb__meta-value">{extractFileName(thumbnail)}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="admin-product-category-thumb__empty">
            <p className="admin-product-category-thumb__empty-text">Danh mục này chưa có ảnh đại diện.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductCategoryThumbnail
