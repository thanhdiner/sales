import { useTranslation } from 'react-i18next'
import { getLocalizedProductCategoryTitle } from '../../utils/productLocalization'

function FieldTitle({ category }) {
  const { t, i18n } = useTranslation('adminProducts')
  const language = i18n.resolvedLanguage || i18n.language

  return <>{getLocalizedProductCategoryTitle({ productCategory: category }, language, t('table.uncategorized'))}</>
}

export default FieldTitle
