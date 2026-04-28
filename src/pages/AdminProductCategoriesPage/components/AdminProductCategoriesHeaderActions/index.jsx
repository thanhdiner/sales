import AddButton from './AddButton'
import ApplyButton from './ApplyButton'
import SelectedItems from './SelectedItems'
import SelectList from './SelectList'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import { useTranslation } from 'react-i18next'

function AdminProductCategoriesHeaderActions({
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
    <div className="product-categories-header">
      <SelectedItems {...{ selectedRowKeys }} />
      <div className="product-categories-header-right">
        {permissions.includes('create_product_category') && <AddButton />}
        <SelectList {...{ value, treeData, setValue }} />
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
      </div>
    </div>
  )
}

export default AdminProductCategoriesHeaderActions
