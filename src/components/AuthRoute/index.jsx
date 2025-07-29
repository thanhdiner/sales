// AuthRoute.jsx (dùng chung cho các trang auth, ngoại trừ login)
import { getClientAccessToken, getClientAccessTokenSession } from '@/utils/auth'
import { Navigate } from 'react-router-dom'

const AuthRoute = ({ children }) => {
  const isLoggedIn = !!(getClientAccessToken() || getClientAccessTokenSession())
  if (isLoggedIn) return <Navigate to="/" replace />
  return children
}

export default AuthRoute
