import ApplyButton from './ApplyButton'
import { buildStatusBulkActions, ResourceBulkActionBar } from '@/components/admin/resources/ResourceManager'
import useAdminPermissions from '@/hooks/admin/useAdminPermissions'
import { useTranslation } from 'react-i18next'

function ProductCategoriesHeaderActions({
  selectedRowKeys,
  value,
  setValue,
  productCategories,
  setProductCategories,
  setTotalProductCategories,
  setSelectedRowKeys,
  editedPositions,
  totalProductCategories,
  currentPage,
  setCurrentPage,
  fetchData
}) {
  const { t } = useTranslation('adminProductCategories')
  const permissions = useAdminPermissions()

  const treeData = buildStatusBulkActions(t, permissions, {
    canDelete: permissions.includes('delete_product_category'),
    canEdit: permissions.includes('edit_product_category'),
    deleteLabel: t('bulk.actions.delete'),
    changePositionLabel: t('bulk.actions.changePosition'),
    changeStatusLabel: t('bulk.actions.changeStatus'),
    activeLabel: t('status.active'),
    inactiveLabel: t('status.inactive')
  })

  return (
    <ResourceBulkActionBar
      className="product-categories-header"
      rightClassName="product-categories-header-right"
      selectedCountClassName="admin-product-categories-selected-count"
      selectedCount={selectedRowKeys.length}
      selectedLabel={t('bulk.selected', { count: selectedRowKeys.length })}
      addConfig={
        permissions.includes('create_product_category')
          ? {
              to: '/admin/product-categories/create',
              buttonClassName: 'admin-product-categories-btn admin-product-categories-btn--add admin-resource-btn--add font-bold',
              label: t('bulk.add')
            }
          : null
      }
      actionConfig={{
        value,
        treeData,
        onChange: setValue,
        placeholder: t('bulk.choiceAction'),
        className: 'admin-product-categories-action-select',
        popupClassName: 'admin-product-categories-popup admin-product-categories-action-popup',
        dropdownClassName: 'admin-product-categories-popup admin-product-categories-action-popup',
        getPopupContainer: trigger => trigger?.parentElement || document.body
      }}
    >
      <ApplyButton
        {...{
          value,
          setValue,
          selectedRowKeys,
          productCategories,
          setProductCategories,
          setTotalProductCategories,
          setSelectedRowKeys,
          editedPositions,
          totalProductCategories,
          currentPage,
          setCurrentPage,
          fetchData
        }}
      />
    </ResourceBulkActionBar>
  )
}

export default ProductCategoriesHeaderActions
