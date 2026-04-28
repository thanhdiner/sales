import useClientAuthStatus from '@/hooks/useClientAuthStatus'
import { getClientPostLoginPath } from '@/utils/auth'
import { Navigate, useLocation } from 'react-router-dom'

const AuthRoute = ({ children }) => {
  const location = useLocation()
  const { isAuthenticated, isChecking } = useClientAuthStatus()

  if (isChecking) return null

  if (isAuthenticated) {
    return <Navigate to={getClientPostLoginPath(location.state?.from)} replace />
  }

  return children
}

export default AuthRoute
