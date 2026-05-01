export const route = (path, Component, access = {}, options = {}) => ({
  path,
  Component,
  ...access,
  ...options
})

export const menuRoute = (path, Component, access, labelKey, options = {}) => route(path, Component, access, {
  key: path,
  labelKey,
  menu: true,
  matchPaths: [path],
  ...options
})

export const group = (key, labelKey, icon, children) => ({
  key,
  labelKey,
  icon,
  children
})

const pickMenuFields = item => ({
  key: item.key || item.path,
  labelKey: item.labelKey,
  icon: item.icon,
  permission: item.permission,
  permissions: item.permissions,
  requireAll: item.requireAll,
  matchPaths: item.matchPaths
})

export const toMenuConfig = item => {
  if (item.children) {
    return {
      key: item.key,
      labelKey: item.labelKey,
      icon: item.icon,
      children: item.children.map(toMenuConfig).filter(Boolean)
    }
  }

  return item.menu ? pickMenuFields(item) : null
}

export const flattenRoutes = items => items.flatMap(item => {
  if (item.children) return flattenRoutes(item.children)
  return [item, ...(item.relatedRoutes || [])]
})
