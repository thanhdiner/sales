import { useTranslation } from 'react-i18next'
import { getLocalizedProductTitle } from '../../utils/productLocalization'

function FieldThumbnail({ thumbnail, record }) {
  const { i18n } = useTranslation('adminProducts')
  const language = i18n.resolvedLanguage || i18n.language
  const title = getLocalizedProductTitle(record, language, record.title || '')

  return (
    <div className="admin-products-thumbnail-wrap">
      <img src={thumbnail} alt={title} className="admin-products-thumbnail" />
    </div>
  )
}

export default FieldThumbnail
