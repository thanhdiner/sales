import AddButton from './AddButton'
import ApplyButton from './ApplyButton'
import SelectedItems from './SelectedItems'
import SelectList from './SelectList'
import useAdminPermissions from '@/hooks/useAdminPermissions'

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
  const permissions = useAdminPermissions()

  const treeData = [
    permissions.includes('delete_product_category') && {
      title: 'Delete',
      value: 'delete'
    },
    permissions.includes('edit_product_category') && {
      title: 'Change Position',
      value: 'change-position'
    },
    permissions.includes('edit_product_category') && {
      title: 'Change Status',
      value: 'change-status',
      disabled: true,
      children: [
        {
          title: 'Active',
          value: 'status-active'
        },
        {
          title: 'Inactive',
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
