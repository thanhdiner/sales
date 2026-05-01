import { FileExcelOutlined, FilterOutlined, TableOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import DropdownToggleColumns from './DropdownToggleColumns'
import ColumnMenu from './ColumnMenu'
import { getLocalizedProductCategoryParentTitle, getLocalizedProductCategoryTitle } from '../../utils/productCategoryLocalization'
import { useTranslation } from 'react-i18next'

const getUserLabel = value => value?.by?.fullName || value?.by?.email || value?.account_id || ''

const getLastUpdate = value => (Array.isArray(value) && value.length ? value[value.length - 1] : null)

const getExportValue = (productCategory, key, language, t) => {
  switch (key) {
    case 'title':
      return getLocalizedProductCategoryTitle(productCategory, language, productCategory.title || '')
    case 'parent':
      return getLocalizedProductCategoryParentTitle(productCategory, language, t('table.rootCategory'))
    case 'status':
      return t(`status.${productCategory.status}`, { defaultValue: productCategory.status })
    case 'createdBy':
      return getUserLabel(productCategory.createdBy)
    case 'updateBy':
      return getUserLabel(getLastUpdate(productCategory.updateBy))
    case 'updateAt':
      return getLastUpdate(productCategory.updateBy)?.at || productCategory.updatedAt || ''
    default:
      return productCategory[key]
  }
}

const exportToExcel = (productCategories, columnsVisible, sheetName, fileName, language, t) => {
  if (!productCategories || productCategories.length === 0) return

  const visibleKeys = Object.keys(columnsVisible).filter(k => columnsVisible[k] && !['actions', 'thumbnail'].includes(k))

  const data = productCategories.map(productCategory => {
    const row = {}
    visibleKeys.forEach(key => {
      row[key] = getExportValue(productCategory, key, language, t)
    })
    return row
  })

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const file = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(file, fileName)
}

function ProductCategoriesUtility({ handleToggleFilter, columnsVisible, setColumnsVisible, productCategories }) {
  const { t, i18n } = useTranslation('adminProductCategories')
  const language = i18n.resolvedLanguage || i18n.language

  const allColumns = [
    { label: t('columns.id'), value: '_id' },
    { label: t('columns.title'), value: 'title' },
    { label: t('columns.position'), value: 'position' },
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
      label: t('utility.exportProductCategories'),
      mobileLabel: t('utility.exportMobile'),
      className: '',
      onClick: () => exportToExcel(productCategories, columnsVisible, t('utility.sheetName'), t('utility.fileName'), language, t)
    },
    {
      key: 'toggle-columns',
      dropdown: <DropdownToggleColumns {...{ columnMenu }} label={t('utility.toggleColumns')} />,
      icon: <TableOutlined />,
      label: t('utility.toggleColumns'),
      className: ''
    },
    {
      key: 'filter',
      icon: <FilterOutlined />,
      label: t('utility.filter'),
      onClick: handleToggleFilter
    }
  ]

  return (
    <div className="product-categories-utility">
      {utilityButtons(handleToggleFilter).map(btn =>
        btn.dropdown ? (
          <div key={btn.key} className={`admin-product-categories-utility-item admin-product-categories-utility-item--${btn.key}`}>
            {btn.dropdown}
          </div>
        ) : (
          <Button
            key={btn.key}
            onClick={btn.onClick}
            className={`admin-product-categories-btn admin-product-categories-utility-item admin-product-categories-utility-item--${btn.key} ${btn.className || ''}`.trim()}
          >
            {btn.icon}
            <span className="admin-product-categories-btn__label">{btn.label}</span>
            <span className="admin-product-categories-btn__label-mobile">{btn.mobileLabel || btn.label}</span>
          </Button>
        )
      )}
    </div>
  )
}

export default ProductCategoriesUtility
