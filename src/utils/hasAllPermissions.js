export const hasAllPermissions = (permissions, requiredPermissions) => {
  return requiredPermissions.every(p => permissions.includes(p))
}
