import AuthRoute from '@/components/AuthRoute'
import AdminLoginRoute from '@/components/AdminLoginRoute'
import RegisterPage from '@/pages/Auth/RegisterPage'
import ForgotPasswordPage from '@/pages/Auth/ForgotPasswordPage'
import LoginPage from '@/pages/Auth/LoginPage'
import OauthCallbackPage from '@/pages/Auth/OauthCallbackPage'

export const authRoutes = [
  {
    path: '/user/login',
    element: (
      <AuthRoute>
        <LoginPage />
      </AuthRoute>
    )
  },
  {
    path: '/user/register',
    element: (
      <AuthRoute>
        <RegisterPage />
      </AuthRoute>
    )
  },
  {
    path: '/user/forgot-password',
    element: (
      <AuthRoute>
        <ForgotPasswordPage />
      </AuthRoute>
    )
  },
  {
    path: '/user/oauth-callback',
    element: (
      <AuthRoute>
        <OauthCallbackPage />
      </AuthRoute>
    )
  },
  {
    path: '/admin/auth/login',
    element: <AdminLoginRoute />
  }
]
