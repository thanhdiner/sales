import AuthRoute from '@/components/route/AuthRoute'
import AdminLoginRoute from '@/components/route/AdminLoginRoute'
import Register from '@/pages/client/Auth/Register'
import ForgotPassword from '@/pages/client/Auth/ForgotPassword'
import Login from '@/pages/client/Auth/Login'
import OAuthCallback from '@/pages/client/Auth/OAuthCallback'

export const authRoutes = [
  {
    path: '/user/login',
    element: (
      <AuthRoute>
        <Login />
      </AuthRoute>
    )
  },
  {
    path: '/user/register',
    element: (
      <AuthRoute>
        <Register />
      </AuthRoute>
    )
  },
  {
    path: '/user/forgot-password',
    element: (
      <AuthRoute>
        <ForgotPassword />
      </AuthRoute>
    )
  },
  {
    path: '/user/oauth-callback',
    element: (
      <AuthRoute>
        <OAuthCallback />
      </AuthRoute>
    )
  },
  {
    path: '/admin/auth/login',
    element: <AdminLoginRoute />
  }
]
