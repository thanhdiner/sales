import useClientAuthStatus from '@/hooks/auth/useClientAuthStatus'
import { getClientPostLoginPath } from '@/utils/auth'
import { Navigate, useLocation } from 'react-router-dom'

function AuthRouteLoading() {
  return (
    <div className="sovereign-auth-route-loading" role="status" aria-live="polite">
      <span className="sovereign-auth-route-loading__spinner" />
    </div>
  )
}

const AuthRoute = ({ children }) => {
  const location = useLocation()
  const { isAuthenticated, isChecking } = useClientAuthStatus({ skipRefreshWhenNoStoredToken: true })

  if (isChecking) return <AuthRouteLoading />

  if (isAuthenticated) {
    return <Navigate to={getClientPostLoginPath(location.state?.from)} replace />
  }

  return children
}

export default AuthRoute
