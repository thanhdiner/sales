import ApplyButton from './ApplyButton'
import {
  ResourceActionSelect,
  ResourceAddButton,
  ResourceBulkActions
} from '@/components/admin/shared/ResourceManager'
import useAdminPermissions from '@/hooks/admin/useAdminPermissions'
import { useTranslation } from 'react-i18next'

function ProductsHeaderActions({
  selectedRowKeys,
  value,
  setValue,
  products,
  setProducts,
  setTotalProducts,
  setSelectedRowKeys,
  editedPositions,
  totalProducts,
  currentPage,
  setCurrentPage,
  fetchData
}) {
  const { t } = useTranslation('adminProducts')
  const permissions = useAdminPermissions()

  const treeData = [
    permissions.includes('delete_product') && { title: t('bulk.actions.delete'), value: 'delete' },
    permissions.includes('edit_product') && {
      title: t('bulk.actions.changePosition'),
      value: 'change-position'
    },
    permissions.includes('edit_product') && {
      title: t('bulk.actions.changeStatus'),
      value: 'change-status',
      disabled: true,
      children: [
        { title: t('status.active'), value: 'status-active' },
        { title: t('status.inactive'), value: 'status-inactive' }
      ]
    }
  ].filter(Boolean)

  return (
    <ResourceBulkActions
      className="products-header"
      rightClassName="products-header-right"
      selectedCountClassName="admin-products-selected-count ml-2"
      selectedLabel={t('bulk.selected', { count: selectedRowKeys.length })}
    >
      {permissions.includes('create_product') && (
        <ResourceAddButton
          to="/admin/products/create"
          buttonClassName="admin-products-btn admin-products-btn--add font-bold"
          label={t('bulk.add')}
        />
      )}
      <ResourceActionSelect
        value={value}
        treeData={treeData}
        onChange={setValue}
        placeholder={t('bulk.choiceAction')}
        className="admin-products-action-select"
        popupClassName="admin-products-popup"
        dropdownClassName="admin-products-popup"
      />
      <ApplyButton
        {...{
          value,
          setValue,
          selectedRowKeys,
          products,
          setProducts,
          setTotalProducts,
          setSelectedRowKeys,
          editedPositions,
          totalProducts,
          currentPage,
          setCurrentPage,
          fetchData
        }}
      />
    </ResourceBulkActions>
  )
}

export default ProductsHeaderActions
