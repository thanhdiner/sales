import { Navigate } from 'react-router-dom'
import { getAccessToken } from '@/utils/auth'
import AdminLoginPage from '@/pages/admin/Auth/Login'

const AdminLoginRoute = () => {
  const isLoggedIn = !!getAccessToken()
  if (isLoggedIn) return <Navigate to="/admin/dashboard" replace />
  return <AdminLoginPage />
}

export default AdminLoginRoute
