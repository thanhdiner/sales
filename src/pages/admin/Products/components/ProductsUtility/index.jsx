import { FileExcelOutlined, FilterOutlined, TableOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import DropdownToggleColumns from './DropdownToggleColumns'
import ColumnMenu from './ColumnMenu'
import { getLocalizedProductCategoryTitle, getLocalizedProductTitle } from '../../utils/productLocalization'
import { useTranslation } from 'react-i18next'

const getUserLabel = value => value?.by?.fullName || value?.by?.email || value?.account_id || ''

const getLastUpdate = value => (Array.isArray(value) && value.length ? value[value.length - 1] : null)

const getExportValue = (product, key, language, t) => {
  switch (key) {
    case 'title':
      return getLocalizedProductTitle(product, language, product.title || '')
    case 'productCategory':
      return getLocalizedProductCategoryTitle(product, language, t('table.uncategorized'))
    case 'status':
      return t(`status.${product.status}`, { defaultValue: product.status })
    case 'createdBy':
      return getUserLabel(product.createdBy)
    case 'updateBy':
      return getUserLabel(getLastUpdate(product.updateBy))
    case 'updateAt':
      return getLastUpdate(product.updateBy)?.at || product.updatedAt || ''
    default:
      return product[key]
  }
}

const exportToExcel = (products, columnsVisible, language, t) => {
  if (!products || products.length === 0) return

  const visibleKeys = Object.keys(columnsVisible).filter(k => columnsVisible[k] && !['actions', 'thumbnail'].includes(k))

  const data = products.map(product => {
    const row = {}
    visibleKeys.forEach(key => {
      row[key] = getExportValue(product, key, language, t)
    })
    return row
  })

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, t('utility.sheetName'))

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const file = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(file, t('utility.fileName'))
}

function ProductsUtility({ handleToggleFilter, columnsVisible, setColumnsVisible, products }) {
  const { t, i18n } = useTranslation('adminProducts')
  const language = i18n.resolvedLanguage || i18n.language

  const allColumns = [
    { label: t('columns.id'), value: '_id' },
    { label: t('columns.title'), value: 'title' },
    { label: t('columns.price'), value: 'price' },
    { label: t('columns.category'), value: 'productCategory' },
    { label: t('columns.stock'), value: 'stock' },
    { label: t('columns.position'), value: 'position' },
    { label: t('columns.discount'), value: 'discountPercentage' },
    { label: t('columns.status'), value: 'status' },
    { label: t('columns.thumbnailRequired'), value: 'thumbnail', required: true },
    { label: t('columns.actionsRequired'), value: 'actions', required: true },
    { label: t('columns.createdBy'), value: 'createdBy' },
    { label: t('columns.createdAt'), value: 'createdAt' },
    { label: t('columns.updatedBy'), value: 'updateBy' },
    { label: t('columns.updatedAt'), value: 'updateAt' }
  ]
  const columnMenu = <ColumnMenu {...{ columnsVisible, setColumnsVisible, allColumns }} />

  const utilityButtons = handleToggleFilter => [
    {
      key: 'export',
      icon: <FileExcelOutlined />,
      label: t('utility.exportProducts'),
      mobileLabel: t('utility.exportMobile'),
      className: 'admin-products-btn admin-products-btn--utility',
      onClick: () => exportToExcel(products, columnsVisible, language, t)
    },
    {
      key: 'toggle-columns',
      dropdown: <DropdownToggleColumns {...{ columnMenu }} />,
      icon: <TableOutlined />,
      label: t('utility.toggleColumns'),
      className: 'admin-products-btn admin-products-btn--utility'
    },
    {
      key: 'filter',
      icon: <FilterOutlined />,
      label: t('utility.filter'),
      className: 'admin-products-btn admin-products-btn--utility',
      onClick: handleToggleFilter
    }
  ]

  return (
    <div className="products-utility">
      {utilityButtons(handleToggleFilter).map(btn =>
        btn.dropdown ? (
          <div key={btn.key} className={`admin-products-utility-item admin-products-utility-item--${btn.key}`}>
            {btn.dropdown}
          </div>
        ) : (
          <Button
            key={btn.key}
            onClick={btn.onClick}
            className={`${btn.className} admin-products-utility-item admin-products-utility-item--${btn.key}`}
          >
            {btn.icon}
            <span className="admin-products-btn__label">{btn.label}</span>
            <span className="admin-products-btn__label-mobile">{btn.mobileLabel || btn.label}</span>
          </Button>
        )
      )}
    </div>
  )
}

export default ProductsUtility
