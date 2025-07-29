import { Navigate, useLocation } from 'react-router-dom'

export default function AdminRequireAuth({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem('adminAccessToken'))
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/admin/auth/login" state={{ from: location }} replace />
  }
  return children
}
