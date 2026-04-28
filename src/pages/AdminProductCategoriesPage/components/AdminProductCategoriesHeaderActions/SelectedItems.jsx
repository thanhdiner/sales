import { useTranslation } from 'react-i18next'

function SelectedItems({ selectedRowKeys }) {
  const { t } = useTranslation('adminProductCategories')

  return (
    <span className="admin-product-categories-selected-count">
      {t('bulk.selected', { count: selectedRowKeys.length })}
    </span>
  )
}

export default SelectedItems
