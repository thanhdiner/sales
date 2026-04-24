import AddButton from './AddButton'
import ApplyButton from './ApplyButton'
import SelectedItems from './SelectedItems'
import SelectList from './SelectList'
import useAdminPermissions from '@/hooks/useAdminPermissions'

function AdminProductsHeaderActions({
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
  const permissions = useAdminPermissions()

  const treeData = [
    permissions.includes('delete_product') && { title: 'Delete', value: 'delete' },
    permissions.includes('edit_product') && {
      title: 'Change Position',
      value: 'change-position'
    },
    permissions.includes('edit_product') && {
      title: 'Change Status',
      value: 'change-status',
      disabled: true,
      children: [
        { title: 'Active', value: 'status-active' },
        { title: 'Inactive', value: 'status-inactive' }
      ]
    }
  ].filter(Boolean)

  return (
    <div className="products-header">
      <SelectedItems {...{ selectedRowKeys }} />
      <div className="products-header-right">
        {permissions.includes('create_product') && <AddButton />}
        <SelectList {...{ value, treeData, setValue }} />
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
      </div>
    </div>
  )
}

export default AdminProductsHeaderActions
