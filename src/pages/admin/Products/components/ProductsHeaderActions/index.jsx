import ApplyButton from './ApplyButton'
import { buildStatusBulkActions, ResourceBulkActionBar } from '@/components/admin/resources/ResourceManager'
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

  const treeData = buildStatusBulkActions(t, permissions, {
    canDelete: permissions.includes('delete_product'),
    canEdit: permissions.includes('edit_product'),
    deleteLabel: t('bulk.actions.delete'),
    changePositionLabel: t('bulk.actions.changePosition'),
    changeStatusLabel: t('bulk.actions.changeStatus'),
    activeLabel: t('status.active'),
    inactiveLabel: t('status.inactive')
  })

  return (
    <ResourceBulkActionBar
      className="products-header"
      rightClassName="products-header-right"
      selectedCountClassName="admin-products-selected-count ml-2"
      selectedCount={selectedRowKeys.length}
      selectedLabel={t('bulk.selected', { count: selectedRowKeys.length })}
      addConfig={
        permissions.includes('create_product')
          ? {
              to: '/admin/products/create',
              buttonClassName: 'admin-products-btn admin-products-btn--add admin-resource-btn--add font-bold',
              label: t('bulk.add')
            }
          : null
      }
      actionConfig={{
        value,
        treeData,
        onChange: setValue,
        placeholder: t('bulk.choiceAction'),
        className: 'admin-products-action-select',
        popupClassName: 'admin-products-popup',
        dropdownClassName: 'admin-products-popup'
      }}
    >
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
    </ResourceBulkActionBar>
  )
}

export default ProductsHeaderActions
