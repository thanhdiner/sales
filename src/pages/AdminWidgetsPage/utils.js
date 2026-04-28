export const normalizeWidgetActiveValue = value => value === true || value === 'true' || value === 1 || value === '1'

const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

export const getLocalizedWidgetTitle = (widget, language, fallback = '') => {
  if (!widget) return fallback

  const baseValue = widget.title
  const translatedValue = isEnglishLanguage(language) ? widget.translations?.en?.title : null

  if (hasText(translatedValue)) return translatedValue
  if (hasText(baseValue)) return baseValue

  return baseValue ?? fallback
}

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
