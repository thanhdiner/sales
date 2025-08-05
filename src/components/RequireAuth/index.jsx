import { Navigate, useLocation } from 'react-router-dom'

export default function RequireAuth({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem('clientAccessToken')) || Boolean(sessionStorage.getItem('clientAccessToken'))

  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/user/login" state={{ from: location }} replace />
  }
  return children
}
