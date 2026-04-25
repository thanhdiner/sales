import { TreeSelect } from 'antd'

function SelectList({ value, treeData, setValue }) {
  return (
    <TreeSelect
      style={{ width: 160 }}
      className="admin-products-action-select"
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      popupClassName="admin-products-popup"
      dropdownClassName="admin-products-popup"
      treeData={treeData}
      placeholder="Choice Action"
      treeDefaultExpandAll
      onChange={setValue}
      allowClear
    />
  )
}

export default SelectList
