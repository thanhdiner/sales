import { TreeSelect } from 'antd'
import { useTranslation } from 'react-i18next'

function SelectList({ value, treeData, setValue }) {
  const { t } = useTranslation('adminProducts')

  return (
    <TreeSelect
      style={{ width: 160 }}
      className="admin-products-action-select"
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      popupClassName="admin-products-popup"
      dropdownClassName="admin-products-popup"
      treeData={treeData}
      placeholder={t('bulk.choiceAction')}
      treeDefaultExpandAll
      onChange={setValue}
      allowClear
    />
  )
}

export default SelectList
