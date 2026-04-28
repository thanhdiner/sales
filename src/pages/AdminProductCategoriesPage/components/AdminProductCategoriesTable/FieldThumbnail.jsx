import { useTranslation } from 'react-i18next'
import { getLocalizedProductCategoryTitle } from '../../utils/productCategoryLocalization'

function FieldThumbnail({ thumbnail, record }) {
  const { i18n } = useTranslation('adminProductCategories')
  const language = i18n.resolvedLanguage || i18n.language
  const title = getLocalizedProductCategoryTitle(record, language, record.title || '')

  return (
    <div className="admin-product-categories-thumbnail-wrap">
      <img
        src={thumbnail}
        alt={title}
        className="admin-product-categories-thumbnail"
      />
    </div>
  )
}

export default FieldThumbnail
