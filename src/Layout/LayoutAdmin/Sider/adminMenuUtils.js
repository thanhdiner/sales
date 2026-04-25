import { filterMenuChildren } from '@/utils/filterMenuChildren'
import { hasAllPermissions } from '@/utils/hasAllPermissions'
import { adminMenuConfig } from './adminMenuConfig'

const flattenMenuConfig = items => items.flatMap(item => (item.children ? [item, ...flattenMenuConfig(item.children)] : item))

export const adminRouteLabels = flattenMenuConfig(adminMenuConfig).reduce((labels, item) => {
  labels[item.key] = item.label
  return labels
}, {})

export function buildAdminMenuItems(permissions) {
  const canShowMenuItem = item => {
    if (item.permissions) return hasAllPermissions(permissions, item.permissions)
    if (item.permission) return permissions.includes(item.permission)
    return true
  }

  const buildMenuItem = item => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0

    return {
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: hasChildren ? item.children.filter(canShowMenuItem).map(buildMenuItem) : undefined,
      popupClassName: hasChildren ? 'admin-sider-submenu-popup' : undefined
    }
  }

  return adminMenuConfig.map(buildMenuItem).map(item => (item.children ? filterMenuChildren(item) : item)).filter(Boolean)
}

export function getSelectedAdminMenuKey(pathname) {
  const routePath = pathname.replace(/^\/admin\/?/, '')
  const menuItem = flattenMenuConfig(adminMenuConfig).find(item =>
    item.matchPaths?.some(matchPath => routePath === matchPath || routePath.startsWith(`${matchPath}/`))
  )

  return menuItem?.key || 'dashboard'
}
