import { TreeSelect } from 'antd'

function ResourceActionSelect({ className, dropdownClassName, getPopupContainer, onChange, placeholder, popupClassName, treeData, value }) {
  return (
    <TreeSelect
      style={{ width: 160 }}
      className={className}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      popupClassName={popupClassName || dropdownClassName}
      treeData={treeData}
      placeholder={placeholder}
      treeDefaultExpandAll
      onChange={onChange}
      allowClear
      getPopupContainer={getPopupContainer}
    />
  )
}

export default ResourceActionSelect
