function ResourceBulkActions({ className, rightClassName, selectedCountClassName, selectedLabel, children }) {
  return (
    <div className={className}>
      <span className={selectedCountClassName}>{selectedLabel}</span>
      <div className={rightClassName}>{children}</div>
    </div>
  )
}

export default ResourceBulkActions
