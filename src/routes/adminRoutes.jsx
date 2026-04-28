import { lazy, Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import LayoutAdmin from '../Layout/LayoutAdmin'
import Error404 from '@/pages/Error404'
import AdminRequireAuth from '@/components/AdminRequireAuth'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'
import AccessDenied from '@/components/AccessDenied'

const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'))
const AdminNotificationsPage = lazy(() => import('@/pages/AdminNotificationsPage'))
const AdminProductsPages = lazy(() => import('@/pages/AdminProductsPages'))
const AdminProductsDetails = lazy(() => import('@/pages/AdminProductsPages/AdminProductsDetails'))
const AdminProductsCreate = lazy(() => import('@/pages/AdminProductsPages/AdminProductsCreate'))
const AdminProductsEdit = lazy(() => import('@/pages/AdminProductsPages/AdminProductsEdit'))
const AdminProductCategoriesPage = lazy(() => import('@/pages/AdminProductCategoriesPage'))
const AdminProductCategoriesCreate = lazy(() => import('@/pages/AdminProductCategoriesPage/AdminProductCategoriesCreate'))
const AdminProductCategoriesEdit = lazy(() => import('@/pages/AdminProductCategoriesPage/AdminProductCategoriesEdit'))
const AdminProductCategoriesDetails = lazy(() => import('@/pages/AdminProductCategoriesPage/AdminProductCategoriesDetails'))
const AdminRolesPage = lazy(() => import('@/pages/AdminRolesPage'))
const AdminPermissionsPage = lazy(() => import('@/pages/AdminPermissionsPage'))
const AdminPermissionGroupsPage = lazy(() => import('@/pages/AdminPermissionGroupsPage'))
const AdminRolePermissionPage = lazy(() => import('@/pages/AdminRolePermissionPage'))
const AdminAccountsPage = lazy(() => import('@/pages/AdminAccountsPage'))
const AdminProfilePage = lazy(() => import('@/pages/AdminProfilePage'))
const AdminBankInfoPage = lazy(() => import('@/pages/AdminBankInfoPage'))
const AdminSettingsPage = lazy(() => import('@/pages/AdminSettingsPage'))
const AdminPromoCodesPage = lazy(() => import('@/pages/AdminPromoCodesPage'))
const AdminOrdersPage = lazy(() => import('@/pages/AdminOrdersPage'))
const AdminOrderDetailPage = lazy(() => import('@/pages/AdminOrderDetailPage'))
const AdminPurchaseReceiptsPage = lazy(() => import('@/pages/AdminPurchaseReceiptsPage'))
const AdminWidgetsPage = lazy(() => import('@/pages/AdminWidgetsPage'))
const AdminBannersPage = lazy(() => import('@/pages/AdminBannersPage'))
const AdminAboutPage = lazy(() => import('@/pages/AdminAboutPage'))
const AdminBlogPage = lazy(() => import('@/pages/AdminBlogPage'))
const AdminTermsPage = lazy(() => import('@/pages/AdminTermsPage'))
const AdminCooperationContactPage = lazy(() => import('@/pages/AdminCooperationContactPage'))
const AdminHomeWhyChooseUsPage = lazy(() => import('@/pages/AdminHomeWhyChooseUsPage'))
const AdminContactPageContentPage = lazy(() => import('@/pages/AdminContactPageContentPage'))
const AdminPrivacyPolicyPage = lazy(() => import('@/pages/AdminPrivacyPolicyPage'))
const AdminReturnPolicyPage = lazy(() => import('@/pages/AdminReturnPolicyPage'))
const AdminFaqPage = lazy(() => import('@/pages/AdminFaqPage'))
const AdminFooterPage = lazy(() => import('@/pages/AdminFooterPage'))
const AdminGameAccountPage = lazy(() => import('@/pages/AdminGameAccountPage'))
const AdminGameNewsPage = lazy(() => import('@/pages/AdminGameNewsPage'))
const AdminVipPage = lazy(() => import('@/pages/AdminVipPage'))
const AdminComingSoonPage = lazy(() => import('@/pages/AdminComingSoonPage'))
const AdminFlashSalesPage = lazy(() => import('@/pages/AdminFlashSalesPage'))
const AdminChatPage = lazy(() => import('@/pages/AdminChatPage'))
const AdminQuickRepliesPage = lazy(() => import('@/pages/AdminQuickRepliesPage'))
const AdminReviewsPage = lazy(() => import('@/pages/AdminReviewsPage'))
const AdminChatbotConfigPage = lazy(() => import('@/pages/AdminChatbotConfigPage'))
const AdminChatbotRuntimePage = lazy(() => import('@/pages/AdminChatbotRuntimePage'))
const AdminChatbotRulesPage = lazy(() => import('@/pages/AdminChatbotRulesPage'))
const AdminChatbotToolsPage = lazy(() => import('@/pages/AdminChatbotToolsPage'))
const AdminChatbotToolLogsPage = lazy(() => import('@/pages/AdminChatbotToolLogsPage'))

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
            {lazyElement(AdminDashboard)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'notifications',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminNotificationsPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'products',
        element: (
          <AdminProtectedRoute permission="view_products">
            <AdminRequireAuth>
              {lazyElement(AdminProductsPages)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'products/details/:id',
        element: (
          <AdminProtectedRoute permission="view_products">
            <AdminRequireAuth>
              {lazyElement(AdminProductsDetails)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'products/create',
        element: (
          <AdminProtectedRoute permission="create_product">
            <AdminRequireAuth>
              {lazyElement(AdminProductsCreate)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'products/edit/:id',
        element: (
          <AdminProtectedRoute permission="edit_product">
            <AdminRequireAuth>
              {lazyElement(AdminProductsEdit)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'product-categories',
        element: (
          <AdminProtectedRoute permission="view_product_categories">
            <AdminRequireAuth>
              {lazyElement(AdminProductCategoriesPage)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'product-categories/:id',
        element: (
          <AdminProtectedRoute permission="view_product_categories">
            <AdminRequireAuth>
              {lazyElement(AdminProductCategoriesDetails)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'product-categories/create',
        element: (
          <AdminProtectedRoute permission="create_product_category">
            <AdminRequireAuth>
              {lazyElement(AdminProductCategoriesCreate)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'product-categories/edit/:id',
        element: (
          <AdminProtectedRoute permission="edit_product_category">
            <AdminRequireAuth>
              {lazyElement(AdminProductCategoriesEdit)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'roles',
        element: (
          <AdminProtectedRoute permission="view_roles">
            <AdminRequireAuth>
              {lazyElement(AdminRolesPage)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'permissions',
        element: (
          <AdminProtectedRoute permission="view_permissions">
            <AdminRequireAuth>
              {lazyElement(AdminPermissionsPage)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'permission-groups',
        element: (
          <AdminProtectedRoute permission="view_permission_groups">
            <AdminRequireAuth>
              {lazyElement(AdminPermissionGroupsPage)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'role-permission',
        element: (
          <AdminProtectedRoute permission="view_role_permission">
            <AdminRequireAuth>
              {lazyElement(AdminRolePermissionPage)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'accounts',
        element: (
          <AdminProtectedRoute permission="view_accounts">
            <AdminRequireAuth>
              {lazyElement(AdminAccountsPage)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminProfilePage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'bank-info',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminBankInfoPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'settings',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminSettingsPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'promo-codes',
        element: (
          <AdminProtectedRoute permission="view_promo_codes">
            <AdminRequireAuth>
              {lazyElement(AdminPromoCodesPage)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'orders',
        element: (
          <AdminProtectedRoute permission="view_orders">
            <AdminRequireAuth>
              {lazyElement(AdminOrdersPage)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'orders/:id',
        element: (
          <AdminProtectedRoute permission="view_orders">
            <AdminRequireAuth>
              {lazyElement(AdminOrderDetailPage)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'purchase-receipts',
        element: (
          <AdminProtectedRoute permission="edit_product">
            <AdminRequireAuth>
              {lazyElement(AdminPurchaseReceiptsPage)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'widgets',
        element: (
          <AdminProtectedRoute permission="view_widgets">
            <AdminRequireAuth>
              {lazyElement(AdminWidgetsPage)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'banners',
        element: (
          <AdminProtectedRoute permission="view_banners">
            <AdminRequireAuth>
              {lazyElement(AdminBannersPage)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'about',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminAboutPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'blog',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminBlogPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'terms',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminTermsPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'cooperation-contact',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminCooperationContactPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'home-why-choose-us',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminHomeWhyChooseUsPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'contact-page',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminContactPageContentPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'privacy-policy',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminPrivacyPolicyPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'return-policy',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminReturnPolicyPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'faq',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminFaqPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'footer',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminFooterPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'game-account',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminGameAccountPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'game-news',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminGameNewsPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'vip',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminVipPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'community',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminComingSoonPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'quick-support',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminComingSoonPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'license',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminComingSoonPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'flash-sales',
        element: (
          <AdminProtectedRoute permission="view_flashsales">
            <AdminRequireAuth>
              {lazyElement(AdminFlashSalesPage)}
            </AdminRequireAuth>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'chat',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminChatPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'live-chat/quick-replies',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminQuickRepliesPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'reviews',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminReviewsPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'chatbot-config',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminChatbotConfigPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'chatbot-runtime',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminChatbotRuntimePage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'chatbot-rules',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminChatbotRulesPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'chatbot-tools',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminChatbotToolsPage)}
          </AdminRequireAuth>
        )
      },
      {
        path: 'chatbot-tool-logs',
        element: (
          <AdminRequireAuth>
            {lazyElement(AdminChatbotToolLogsPage)}
          </AdminRequireAuth>
        )
      },
      { path: '403', element: <AccessDenied /> },
      { path: '*', element: <Error404 path="/admin/dashboard" /> }
    ]
  }
]
