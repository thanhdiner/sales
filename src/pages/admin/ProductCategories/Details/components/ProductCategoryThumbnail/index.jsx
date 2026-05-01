import { FileImageOutlined, PictureOutlined } from '@ant-design/icons'
import { extractFileName } from '@/utils/extractFileName'
import { useTranslation } from 'react-i18next'

function ProductCategoryThumbnail({ thumbnail, title }) {
  const { t } = useTranslation('adminProductCategories')

  return (
    <section className="admin-product-category-thumb">
      <div className="admin-product-category-thumb__head">
        <div className="admin-product-category-thumb__icon">
          <PictureOutlined />
        </div>

        <div>
          <h2 className="admin-product-category-thumb__title">{t('details.thumbnail.title')}</h2>
          <p className="admin-product-category-thumb__description">{t('details.thumbnail.description')}</p>
        </div>
      </div>

      <div className="admin-product-category-thumb__body">
        {thumbnail ? (
          <>
            <div className="admin-product-category-thumb__image-frame">
              <img className="admin-product-category-thumb__image" src={thumbnail} alt={title || t('details.thumbnail.alt')} />
            </div>

            <div className="admin-product-category-thumb__meta">
              <div className="admin-product-category-thumb__meta-row">
                <div className="admin-product-category-thumb__meta-icon">
                  <FileImageOutlined />
                </div>

                <div>
                  <p className="admin-product-category-thumb__meta-label">{t('details.thumbnail.fileName')}</p>
                  <p className="admin-product-category-thumb__meta-value">{extractFileName(thumbnail)}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="admin-product-category-thumb__empty">
            <p className="admin-product-category-thumb__empty-text">{t('details.thumbnail.empty')}</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductCategoryThumbnail
