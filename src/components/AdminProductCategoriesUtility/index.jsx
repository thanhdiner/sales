import { FileExcelOutlined, FilterOutlined, TableOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import DropdownToggleColumns from './DropdownToggleColumns'
import ColumnMenu from './ColumnMenu'

const exportToExcel = (productCategories, columnsVisible) => {
  if (!productCategories || productCategories.length === 0) return

  const visibleKeys = Object.keys(columnsVisible).filter(k => columnsVisible[k] && !['actions', 'thumbnail'].includes(k))

  const data = productCategories.map(productCategory => {
    const row = {}
    visibleKeys.forEach(key => {
      row[key] = productCategory[key]
    })
    return row
  })

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Categories')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const file = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(file, 'product_categories_export.xlsx')
}

function AdminProductsUtility({ handleToggleFilter, columnsVisible, setColumnsVisible, productCategories }) {
  const allColumns = [
    { label: 'ID', value: '_id' },
    { label: 'Title', value: 'title' },
    { label: 'Position', value: 'position' },
    { label: 'Status', value: 'status' },
    { label: 'Thumbnail *', value: 'thumbnail', required: true },
    { label: 'Actions *', value: 'actions', required: true }
  ]
  const columnMenu = <ColumnMenu {...{ columnsVisible, setColumnsVisible, allColumns }} />

  const utilityButtons = handleToggleFilter => [
    {
      key: 'export',
      icon: <FileExcelOutlined />,
      label: 'Export Product Categories',
      className: '',
      color: 'cyan',
      variant: 'solid',
      onClick: () => exportToExcel(productCategories, columnsVisible)
    },
    {
      key: 'toggle-columns',
      dropdown: <DropdownToggleColumns {...{ columnMenu }} />,
      icon: <TableOutlined />,
      label: 'Toggle Columns',
      className: 'custom-btn-orange'
    },
    {
      key: 'filter',
      icon: <FilterOutlined />,
      label: 'Filter',
      onClick: handleToggleFilter
    }
  ]

  return (
    <div className="product-categories-utility">
      {utilityButtons(handleToggleFilter).map(btn =>
        btn.dropdown ? (
          <div key={btn.key}>{btn.dropdown}</div>
        ) : (
          <Button key={btn.key} onClick={btn.onClick} className={btn.className} color={btn.color} variant={btn.variant}>
            {btn.icon}
            {btn.label}
          </Button>
        )
      )}
    </div>
  )
}

export default AdminProductsUtility
