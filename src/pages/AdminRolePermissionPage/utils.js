export function getActivePermissions(permissions = []) {
  return permissions.filter(permission => !permission.deleted)
}

export function getPermissionNames(permissions = []) {
  return getActivePermissions(permissions).map(permission => permission.name)
}

export function getGroupPermissionNames(permissions = [], groupValue) {
  return permissions
    .filter(permission => permission.group === groupValue && !permission.deleted)
    .map(permission => permission.name)
}

export function buildRolePermissionMap(roles = []) {
  return roles.reduce((mapping, role) => {
    mapping[role._id] = role.permissions || []
    return mapping
  }, {})
}

export function isRoleSelectAll(rolePermissions = [], permissions = []) {
  const permissionNames = getPermissionNames(permissions)
  return permissionNames.every(permissionName => rolePermissions.includes(permissionName))
}

export function isGroupSelectAll(rolePermissions = [], permissions = [], groupValue) {
  const groupPermissionNames = getGroupPermissionNames(permissions, groupValue)

  if (!groupPermissionNames.length) {
    return false
  }

  return groupPermissionNames.every(permissionName => rolePermissions.includes(permissionName))
}

export function buildRolePermissionDataSource(permissionGroups = [], permissions = []) {
  const dataSource = [
    {
      key: 'select-all-row',
      title: 'Select all',
      isSelectAll: true
    }
  ]

  permissionGroups.forEach(group => {
    const groupPermissions = permissions.filter(permission => permission.group === group.value && !permission.deleted)

    if (!groupPermissions.length) {
      return
    }

    dataSource.push({
      key: `group-selectall-${group.value}`,
      title: group.label,
      isGroupSelectAll: true,
      groupValue: group.value
    })

    groupPermissions.forEach(permission => {
      dataSource.push({
        ...permission,
        key: permission._id
      })
    })
  })

  return dataSource
}
