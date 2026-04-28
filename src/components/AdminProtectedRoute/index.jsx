import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const normalizeText = value => String(value || '').trim().toLowerCase()

const isSuperAdmin = user => {
  const roleLabel = normalizeText(user?.role_id?.label || user?.role?.label || user?.role_id || user?.role)
  const username = normalizeText(user?.username)

  return username === 'superadmin' || roleLabel === 'superadmin' || roleLabel === 'super admin'
}

function AdminProtectedRoute({ permission, permissions: requiredPermissions, requireAll = true, children }) {
  const user = useSelector(state => state.adminUser.user)

  if (!user) return null

  if (isSuperAdmin(user)) return children

  const permissions = user.role_id?.permissions || []
  const required = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : permission
      ? [permission]
      : []

  const hasAccess = required.length === 0 ||
    (requireAll
      ? required.every(item => permissions.includes(item))
      : required.some(item => permissions.includes(item)))

  if (!hasAccess) return <Navigate to="/admin/403" replace />

  return children
}

export default AdminProtectedRoute
