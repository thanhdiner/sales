import { filterMenuChildren } from '@/utils/filterMenuChildren'
import { hasAllPermissions } from '@/utils/hasAllPermissions'
import { adminMenuConfig } from './adminMenuConfig'

const flattenMenuConfig = items => items.flatMap(item => (item.children ? [item, ...flattenMenuConfig(item.children)] : item))

export const adminRouteLabelKeys = flattenMenuConfig(adminMenuConfig).reduce((labels, item) => {
  labels[item.key] = item.labelKey
  return labels
}, {
  admin: 'routes.admin',
  profile: 'routes.profile',
  settings: 'routes.settings',
  details: 'routes.details',
  create: 'routes.create',
  edit: 'routes.edit',
  'quick-replies': 'routes.quick-replies',
  '403': 'routes.403'
})

export function buildAdminMenuItems(permissions, translate = labelKey => labelKey, options = {}) {
  const permissionList = Array.isArray(permissions) ? permissions : []
  const preservePermissionItems = options.preservePermissionItems === true
  const compactGroups = options.compactGroups || {}

  const hasPermissionRule = item => Boolean(
    item.permission ||
    item.permissions ||
    item.children?.some(hasPermissionRule)
  )

  const canShowMenuItem = item => {
    if (preservePermissionItems && hasPermissionRule(item)) return true
    if (item.permissions) return hasAllPermissions(permissionList, item.permissions)
    if (item.permission) return permissionList.includes(item.permission)
    return true
  }

  const buildMenuItem = item => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0
    const compactGroup = compactGroups[item.key]

    if (hasChildren && compactGroup) {
      return {
        key: compactGroup.key,
        icon: item.icon,
        label: translate(compactGroup.labelKey || item.labelKey),
        disabled: preservePermissionItems && hasPermissionRule(item)
      }
    }

    return {
      key: item.key,
      icon: item.icon,
      label: translate(item.labelKey),
      disabled: preservePermissionItems && hasPermissionRule(item),
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
