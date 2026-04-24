import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function AdminProtectedRoute({ permission, children }) {
  const user = useSelector(state => state.adminUser.user)

  if (!user) return null

  const permissions = user.role_id?.permissions || []
  if (!permissions.includes(permission)) return <Navigate to="/admin/403" replace />
  return children
}

export default AdminProtectedRoute
