import ApplyButton from './ApplyButton'
import {
  ResourceActionSelect,
  ResourceAddButton,
  ResourceBulkActions
} from '@/components/admin/shared/ResourceManager'
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

  const treeData = [
    permissions.includes('delete_product_category') && {
      title: t('bulk.actions.delete'),
      value: 'delete'
    },
    permissions.includes('edit_product_category') && {
      title: t('bulk.actions.changePosition'),
      value: 'change-position'
    },
    permissions.includes('edit_product_category') && {
      title: t('bulk.actions.changeStatus'),
      value: 'change-status',
      disabled: true,
      children: [
        {
          title: t('status.active'),
          value: 'status-active'
        },
        {
          title: t('status.inactive'),
          value: 'status-inactive'
        }
      ]
    }
  ].filter(Boolean)

  return (
    <ResourceBulkActions
      className="product-categories-header"
      rightClassName="product-categories-header-right"
      selectedCountClassName="admin-product-categories-selected-count"
      selectedLabel={t('bulk.selected', { count: selectedRowKeys.length })}
    >
      {permissions.includes('create_product_category') && (
        <ResourceAddButton
          to="/admin/product-categories/create"
          buttonClassName="admin-product-categories-btn admin-product-categories-btn--add font-bold"
          label={t('bulk.add')}
        />
      )}
      <ResourceActionSelect
        value={value}
        treeData={treeData}
        onChange={setValue}
        placeholder={t('bulk.choiceAction')}
        className="admin-product-categories-action-select"
        popupClassName="admin-product-categories-popup admin-product-categories-action-popup"
        dropdownClassName="admin-product-categories-popup admin-product-categories-action-popup"
        getPopupContainer={trigger => trigger?.parentElement || document.body}
      />
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
    </ResourceBulkActions>
  )
}

export default ProductCategoriesHeaderActions
