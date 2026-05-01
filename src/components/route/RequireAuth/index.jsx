import { Navigate, useLocation } from 'react-router-dom'
import useClientAuthStatus from '@/hooks/auth/useClientAuthStatus'

export default function RequireAuth({ children }) {
  const location = useLocation()
  const { isAuthenticated, isChecking } = useClientAuthStatus()

  if (isChecking) return null

  if (!isAuthenticated) {
    return <Navigate to="/user/login" state={{ from: location }} replace />
  }

  return children
}
