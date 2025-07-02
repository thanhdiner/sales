import { TreeSelect } from 'antd'

function SelectList({ value, treeData, setValue }) {
  return (
    <TreeSelect
      style={{ width: 160 }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData}
      placeholder="Choice Action"
      treeDefaultExpandAll
      onChange={setValue}
      allowClear
    />
  )
}

export default SelectList
