import { Navigate } from 'react-router-dom'
import LayoutAdmin from '../Layout/LayoutAdmin'
import Error404 from '@/pages/Error404'
import AdminDashboard from '@/pages/AdminDashboard'
import AdminProductsPages from '@/pages/AdminProductsPages'
import AdminProductsDetails from '@/pages/AdminProductsPages/AdminProductsDetails'
import AdminProductsCreate from '@/pages/AdminProductsPages/AdminProductsCreate'
import AdminProductsEdit from '@/pages/AdminProductsPages/AdminProductsEdit'
import AdminProductCategoriesPage from '@/pages/AdminProductCategoriesPage'
import AdminProductCategoriesCreate from '@/pages/AdminProductCategoriesPage/AdminProductCategoriesCreate'
import AdminProductCategoriesEdit from '@/pages/AdminProductCategoriesPage/AdminProductCategoriesEdit'
import AdminProductCategoriesDetails from '@/pages/AdminProductCategoriesPage/AdminProductCategoriesDetails'
import AdminRolesPage from '@/pages/AdminRolesPage'
import AdminPermissionsPage from '@/pages/AdminPermissionsPage'
import AdminPermissionGroupsPage from '@/pages/AdminPermissionGroupsPage'
import AdminRolePermissionPage from '@/pages/AdminRolePermissionPage'
import AdminAccountsPage from '@/pages/AdminAccountsPage'
import AdminProfilePage from '@/pages/AdminProfilePage'
import AdminBankInfoPage from '@/pages/AdminBankInfoPage'
import AdminSettingsPage from '@/pages/AdminSettingsPage'
import AdminPromoCodesPage from '@/pages/AdminPromoCodesPage'
import AdminOrdersPage from '@/pages/AdminOrdersPage'
import AdminOrderDetailPage from '@/pages/AdminOrderDetailPage'
import AdminWidgetsPage from '@/pages/AdminWidgetsPage'
import AdminBannersPage from '@/pages/AdminBannersPage'
import AdminFlashSalesPage from '@/pages/AdminFlashSalesPage'
import AdminChatPage from '@/pages/AdminChatPage'
import AdminReviewsPage from '@/pages/AdminReviewsPage'
import AdminChatbotConfigPage from '@/pages/AdminChatbotConfigPage'
import AdminChatbotRuntimePage from '@/pages/AdminChatbotRuntimePage'
import AdminChatbotRulesPage from '@/pages/AdminChatbotRulesPage'
import AdminChatbotToolsPage from '@/pages/AdminChatbotToolsPage'
import AdminChatbotToolLogsPage from '@/pages/AdminChatbotToolLogsPage'
import AdminRequireAuth from '@/components/AdminRequireAuth'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'
import AccessDenied from '@/components/AccessDenied'

export const adminRoutes = [
  {
    path: '/admin',
    element: (
      <AdminRequireAuth>
        <LayoutAdmin />
      </AdminRequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      {
        path: 'dashboard',
        element: (
          <AdminRequireAuth>
            <AdminDashboard />
          </AdminRequireAuth>
        )
      },
      {
        path: 'products',
        element: (
          <AdminProtectedRoute permission="view_products">
            <AdminRequireAuth>
              <AdminProductsPages />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'products/details/:id',
        element: (
          <AdminProtectedRoute permission="view_products">
            <AdminRequireAuth>
              <AdminProductsDetails />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'products/create',
        element: (
          <AdminProtectedRoute permission="create_product">
            <AdminRequireAuth>
              <AdminProductsCreate />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'products/edit/:id',
        element: (
          <AdminProtectedRoute permission="edit_product">
            <AdminRequireAuth>
              <AdminProductsEdit />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'product-categories',
        element: (
          <AdminProtectedRoute permission="view_product_categories">
            <AdminRequireAuth>
              <AdminProductCategoriesPage />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'product-categories/:id',
        element: (
          <AdminProtectedRoute permission="view_product_categories">
            <AdminRequireAuth>
              <AdminProductCategoriesDetails />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'product-categories/create',
        element: (
          <AdminProtectedRoute permission="create_product_category">
            <AdminRequireAuth>
              <AdminProductCategoriesCreate />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'product-categories/edit/:id',
        element: (
          <AdminProtectedRoute permission="edit_product_category">
            <AdminRequireAuth>
              <AdminProductCategoriesEdit />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'roles',
        element: (
          <AdminProtectedRoute permission="view_roles">
            <AdminRequireAuth>
              <AdminRolesPage />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'permissions',
        element: (
          <AdminProtectedRoute permission="view_permissions">
            <AdminRequireAuth>
              <AdminPermissionsPage />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'permission-groups',
        element: (
          <AdminProtectedRoute permission="view_permission_groups">
            <AdminRequireAuth>
              <AdminPermissionGroupsPage />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'role-permission',
        element: (
          <AdminProtectedRoute permission="view_role_permission">
            <AdminRequireAuth>
              <AdminRolePermissionPage />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'accounts',
        element: (
          <AdminProtectedRoute permission="view_accounts">
            <AdminRequireAuth>
              <AdminAccountsPage />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <AdminRequireAuth>
            <AdminProfilePage />
          </AdminRequireAuth>
        )
      },
      {
        path: 'bank-info',
        element: (
          <AdminRequireAuth>
            <AdminBankInfoPage />
          </AdminRequireAuth>
        )
      },
      {
        path: 'settings',
        element: (
          <AdminRequireAuth>
            <AdminSettingsPage />
          </AdminRequireAuth>
        )
      },
      {
        path: 'promo-codes',
        element: (
          <AdminProtectedRoute permission="view_promo_codes">
            <AdminRequireAuth>
              <AdminPromoCodesPage />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'orders',
        element: (
          <AdminProtectedRoute permission="view_orders">
            <AdminRequireAuth>
              <AdminOrdersPage />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'orders/:id',
        element: (
          <AdminProtectedRoute permission="view_orders">
            <AdminRequireAuth>
              <AdminOrderDetailPage />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'widgets',
        element: (
          <AdminProtectedRoute permission="view_widgets">
            <AdminRequireAuth>
              <AdminWidgetsPage />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'banners',
        element: (
          <AdminProtectedRoute permission="view_banners">
            <AdminRequireAuth>
              <AdminBannersPage />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'flash-sales',
        element: (
          <AdminProtectedRoute permission="view_flashsales">
            <AdminRequireAuth>
              <AdminFlashSalesPage />
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'chat',
        element: (
          <AdminRequireAuth>
            <AdminChatPage />
          </AdminRequireAuth>
        )
      },
      {
        path: 'reviews',
        element: (
          <AdminRequireAuth>
            <AdminReviewsPage />
          </AdminRequireAuth>
        )
      },
      {
        path: 'chatbot-config',
        element: (
          <AdminRequireAuth>
            <AdminChatbotConfigPage />
          </AdminRequireAuth>
        )
      },
      {
        path: 'chatbot-runtime',
        element: (
          <AdminRequireAuth>
            <AdminChatbotRuntimePage />
          </AdminRequireAuth>
        )
      },
      {
        path: 'chatbot-rules',
        element: (
          <AdminRequireAuth>
            <AdminChatbotRulesPage />
          </AdminRequireAuth>
        )
      },
      {
        path: 'chatbot-tools',
        element: (
          <AdminRequireAuth>
            <AdminChatbotToolsPage />
          </AdminRequireAuth>
        )
      },
      {
        path: 'chatbot-tool-logs',
        element: (
          <AdminRequireAuth>
            <AdminChatbotToolLogsPage />
          </AdminRequireAuth>
        )
      },
      { path: '403', element: <AccessDenied /> },
      { path: '*', element: <Error404 path="/admin/dashboard" /> }
    ]
  }
]
