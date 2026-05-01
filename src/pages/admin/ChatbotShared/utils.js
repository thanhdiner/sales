export const RISK_COLORS = {
  safe: 'green',
  write: 'orange',
  dangerous: 'red',
  caution: 'orange',
  restricted: 'red'
}

export const OUTCOME_COLORS = {
  success: 'green',
  not_found: 'gold',
  error: 'red'
}

export const formatDateTime = (value, locale = 'vi-VN') => {
  if (!value) return '--'

  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(value))
  } catch {
    return value
  }
}

export const formatJsonCompact = value => {
  if (value == null) return '--'

  if (typeof value === 'string') {
    return value
  }

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export const buildToolSettingsPayload = toolRegistry =>
  (toolRegistry || []).map(tool => ({
    name: tool.name,
    enabled: tool.enabled !== false
  }))
