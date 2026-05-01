import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import AdminLayout from '@/layouts/admin'
import Error404 from '@/pages/client/Error404'
import AdminRequireAuth from '@/components/route/AdminRequireAuth'
import AdminProtectedRoute from '@/components/route/AdminProtectedRoute'
import AccessDenied from '@/components/shared/AccessDenied'
import { adminPageRoutes } from '@/config/adminRegistry'

const AdminRouteFallback = () => (
  <div className="flex min-h-[240px] items-center justify-center text-sm text-gray-500 dark:text-gray-300">
    Loading...
  </div>
)

const lazyElement = Component => (
  <Suspense fallback={<AdminRouteFallback />}>
    <Component />
  </Suspense>
)

const withAdminAuth = children => (
  <AdminRequireAuth>
    {children}
  </AdminRequireAuth>
)

const renderAdminRouteElement = route => {
  const page = withAdminAuth(lazyElement(route.Component))
  const permissions = Array.isArray(route.permissions) ? route.permissions : undefined
  const needsPermissionGuard = Boolean(route.permission || permissions?.length)

  if (!needsPermissionGuard) return page

  return (
    <AdminProtectedRoute permission={route.permission} permissions={permissions} requireAll={route.requireAll ?? true}>
      {page}
    </AdminProtectedRoute>
  )
}

const createAdminRoute = route => ({
  path: route.path,
  element: renderAdminRouteElement(route)
})

export const adminRoutes = [
  {
    path: '/admin',
    element: (
      <AdminRequireAuth>
        <AdminLayout />
      </AdminRequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      ...adminPageRoutes.map(createAdminRoute),
      { path: '403', element: <AccessDenied /> },
      { path: '*', element: <Error404 path="/admin/dashboard" /> }
    ]
  }
]
