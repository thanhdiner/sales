import ResourceActionSelect from './ResourceActionSelect'
import ResourceAddButton from './ResourceAddButton'

function ResourceBulkActionBar({
  className,
  rightClassName,
  selectedCountClassName,
  selectedCount,
  selectedLabel,
  addConfig,
  actionConfig,
  children
}) {
  return (
    <div className={className}>
      <span className={selectedCountClassName}>{selectedLabel || selectedCount}</span>
      <div className={rightClassName}>
        {addConfig && <ResourceAddButton {...addConfig} />}
        {actionConfig && <ResourceActionSelect {...actionConfig} />}
        {children}
      </div>
    </div>
  )
}

export default ResourceBulkActionBar
