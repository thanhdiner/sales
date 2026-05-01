import { useTranslation } from 'react-i18next'

function SelectedItems({ selectedRowKeys }) {
  const { t } = useTranslation('adminProducts')

  return (
    <span className="admin-products-selected-count ml-2">
      {t('bulk.selected', { count: selectedRowKeys.length })}
    </span>
  )
}

export default SelectedItems
