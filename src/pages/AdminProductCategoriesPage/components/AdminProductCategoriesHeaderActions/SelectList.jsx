import { TreeSelect } from 'antd'

function SelectList({ value, treeData, setValue }) {
  return (
    <TreeSelect
      style={{ width: 160 }}
      className="admin-product-categories-action-select"
      popupClassName="admin-product-categories-popup admin-product-categories-action-popup"
      dropdownClassName="admin-product-categories-popup admin-product-categories-action-popup"
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData}
      placeholder="Choice Action"
      treeDefaultExpandAll
      onChange={setValue}
      allowClear
      getPopupContainer={trigger => trigger?.parentElement || document.body}
    />
  )
}

export default SelectList
