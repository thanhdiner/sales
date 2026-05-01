export const cloneContent = value => {
  if (value === undefined || value === null) return value
  return JSON.parse(JSON.stringify(value))
}

export function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function mergeDefaults(defaultValue, value) {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(value) ? value : cloneContent(defaultValue)
  }

  if (isPlainObject(defaultValue)) {
    const source = isPlainObject(value) ? value : {}
    const keys = new Set([...Object.keys(defaultValue), ...Object.keys(source)])

    return Array.from(keys).reduce((result, key) => {
      result[key] = Object.prototype.hasOwnProperty.call(source, key)
        ? mergeDefaults(defaultValue[key], source[key])
        : cloneContent(defaultValue[key])
      return result
    }, {})
  }

  if (typeof defaultValue === 'string') {
    if (typeof value !== 'string') return defaultValue
    return value.trim() === '[object Object]' ? defaultValue : value
  }

  return value ?? defaultValue ?? ''
}

export function getEditableBaseContent(data, omittedKeys = []) {
  if (!data) return {}

  const omit = new Set([
    '_id',
    '__v',
    'createdAt',
    'updatedAt',
    'createdBy',
    'updatedBy',
    'translations',
    ...omittedKeys
  ])

  return Object.keys(data).reduce((result, key) => {
    if (!omit.has(key)) result[key] = data[key]
    return result
  }, {})
}

export function buildLocalizedInitialValues(data, defaults, options = {}) {
  return {
    content: mergeDefaults(defaults.vi || {}, getEditableBaseContent(data, options.omittedKeys)),
    translations: {
      en: mergeDefaults(defaults.en || {}, data?.translations?.en || {})
    }
  }
}
