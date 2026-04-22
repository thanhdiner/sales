export const normalizeWidgetActiveValue = value => value === true || value === 'true' || value === 1 || value === '1'

export const getWidgetIconFileList = widget => {
  if (!widget?.iconUrl) {
    return []
  }

  return [
    {
      uid: widget._id,
      name: widget.iconUrl.split('/').pop(),
      status: 'done',
      url: widget.iconUrl
    }
  ]
}

export const getWidgetStats = widgets => ({
  total: widgets.length,
  active: widgets.filter(widget => widget.isActive).length,
  inactive: widgets.filter(widget => !widget.isActive).length
})
