import LayoutDefault from '../Layout/LayoutDefault'
import Home from '@/pages/Home'
import ProductsPages from '@/pages/ProductsPages'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Blog from '@/pages/Blog'
import Error404 from '@/pages/Error404'
import ProductsDetail from '@/pages/ProductsPages/ProductsDetail'
import AdminDashboard from '@/pages/AdminDashboard'
import LayoutAdmin from '../Layout/LayoutAdmin'
import AdminProductsPages from '@/pages/AdminProductsPages'
import AdminProductsDetails from '@/pages/AdminProductsPages/AdminProductsDetails'
import { Navigate } from 'react-router-dom'
import AdminProductsCreate from '@/pages/AdminProductsPages/AdminProductsCreate'
import AdminProductsEdit from '@/pages/AdminProductsPages/AdminProductsEdit'
import AdminProductCategoriesPage from '@/pages/AdminProductCategoriesPage'
import AdminProductCategoriesCreate from '@/pages/AdminProductCategoriesPage/AdminProductCategoriesCreate'
import AdminProductCategoriesEdit from '@/pages/AdminProductCategoriesPage/AdminProductCategoriesEdit'
import AdminRolesPage from '@/pages/AdminRolesPage'
import AdminPermissionsPage from '@/pages/AdminPermissionsPage'
import AdminProductCategoriesDetails from '@/pages/AdminProductCategoriesPage/AdminProductCategoriesDetails'
import AdminPermissionGroupsPage from '@/pages/AdminPermissionGroupsPage'
import AdminRolePermissionPage from '@/pages/AdminRolePermissionPage'
import AdminAccountsPage from '@/pages/AdminAccountsPage'
import AdminRequireAuth from '@/components/AdminRequireAuth'
import AdminLoginRoute from '@/components/AdminLoginRoute'
import AdminProfilePage from '@/pages/AdminProfilePage'
import AdminSettingsPage from '@/pages/AdminSettingsPage'
import AccessDenied from '@/components/AccessDenied'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'
import AuthRoute from '@/components/AuthRoute'
import RegisterPage from '@/pages/Auth/RegisterPage'
import ForgotPasswordPage from '@/pages/Auth/ForgotPasswordPage'
import LoginPage from '@/pages/Auth/LoginPage'
import OauthCallbackPage from '@/pages/Auth/OauthCallbackPage'
import ProfilePage from '@/pages/ProfilePage'
import CartPage from '@/pages/CartPage'
import AdminPromoCodesPage from '@/pages/AdminPromoCodesPage'
import CheckoutPage from '@/pages/CheckoutPage'
import OrderSuccessPage from '@/pages/OrderSuccessPage'
import OrdersPage from '@/pages/OrdersPage'
import OrderDetailPage from '@/pages/OrderDetailPage'
import AdminOrdersPage from '@/pages/AdminOrdersPage'
import AdminOrderDetailPage from '@/pages/AdminOrderDetailPage'
import RequireAuth from '@/components/RequireAuth'
import AdminWidgetsPage from '@/pages/AdminWidgetsPage'
import AdminBannersPage from '@/pages/AdminBannersPage'
import AdminFlashSalesPage from '@/pages/AdminFlashSalesPage'
import FlashSalePage from '@/pages/FlashSalePage'
import ShoppingGuide from '@/pages/ShoppingGuide'
import CouponsPage from '@/pages/CouponsPage'
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage'
import ReturnPolicyPage from '@/pages/ReturnPolicyPage'
import FAQPage from '@/pages/FAQPage'
import TermsOfServicePage from '@/pages/TermsOfServicePage'
import CooperationContactPage from '@/pages/CooperationContactPage'
import GameAccountComingSoon from '@/pages/GameAccountComingSoon'
import SpecialPackageComingSoon from '@/pages/SpecialPackageComingSoon'
import ProductCategoryPage from '@/pages/ProductCategoryPage'
import GameNewsComingSoon from '@/pages/GameNewsComingSoon'
import VipComingSoon from '@/pages/VipComingSoon'
import CommunityComingSoon from '@/pages/CommunityComingSoon'
import QuickSupportComingSoon from '@/pages/QuickSupportComingSoon'
import LicenseComingSoon from '@/pages/LicenseComingSoon'
import SettingsPage from '@/pages/SettingsPage'
import AdminBankInfoPage from '@/pages/AdminBankInfoPage'
import WishlistPage from '@/pages/WishlistPage'
import ComparePage from '@/pages/ComparePage'
import AdminChatPage from '@/pages/AdminChatPage'
import AdminReviewsPage from '@/pages/AdminReviewsPage'
import AdminChatbotConfigPage from '@/pages/AdminChatbotConfigPage'

export const routes = [
  // Client
  {
    path: '/',
    element: <LayoutDefault />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/products',
        element: <ProductsPages />
      },
      {
        path: '/compare',
        element: <ComparePage />
      },
      {
        path: '/products/:slug',
        element: <ProductsDetail />
      },
      {
        path: '/product-categories/:slug',
        element: <ProductCategoryPage />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        path: '/blog',
        element: <Blog />
      },
      {
        path: '/user/profile',
        element: <ProfilePage />
      },
      {
        path: '/cart',
        element: (
          <RequireAuth>
            <CartPage />
          </RequireAuth>
        )
      },
      {
        path: '/checkout',
        element: (
          <RequireAuth>
            <CheckoutPage />
          </RequireAuth>
        )
      },
      {
        path: '/order-success',
        element: (
          <RequireAuth>
            <OrderSuccessPage />
          </RequireAuth>
        )
      },
      {
        path: '/orders',
        element: (
          <RequireAuth>
            <OrdersPage />
          </RequireAuth>
        )
      },
      {
        path: '/settings',
        element: (
          <RequireAuth>
            <SettingsPage />
          </RequireAuth>
        )
      },
      {
        path: '/wishlist',
        element: (
          <RequireAuth>
            <WishlistPage />
          </RequireAuth>
        )
      },
      {
        path: '/orders/:id',
        element: (
          <RequireAuth>
            <OrderDetailPage />
          </RequireAuth>
        )
      },
      {
        path: '/flash-sale',
        element: <FlashSalePage />
      },
      {
        path: '/shopping-guide',
        element: <ShoppingGuide />
      },
      {
        path: '/coupons',
        element: (
          <RequireAuth>
            <CouponsPage />
          </RequireAuth>
        )
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicyPage />
      },
      {
        path: '/return-policy',
        element: <ReturnPolicyPage />
      },
      {
        path: '/faq',
        element: <FAQPage />
      },
      {
        path: '/terms-of-service',
        element: <TermsOfServicePage />
      },
      {
        path: '/cooperation-contact',
        element: <CooperationContactPage />
      },
      {
        path: '/game-account',
        element: <GameAccountComingSoon />
      },
      {
        path: '/special-package',
        element: <SpecialPackageComingSoon />
      },
      {
        path: '/game-news',
        element: <GameNewsComingSoon />
      },
      {
        path: '/vip',
        element: <VipComingSoon />
      },
      {
        path: '/community',
        element: <CommunityComingSoon />
      },
      {
        path: '/quick-support',
        element: <QuickSupportComingSoon />
      },
      {
        path: '/license',
        element: <LicenseComingSoon />
      },
      {
        path: '*',
        element: <Error404 path="/" />
      }
    ]
  },

  //# Client Auth
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

  //# Admin Login
  {
    path: '/admin/auth/login',
    element: <AdminLoginRoute />
  },

  // Admin
  {
    path: '/admin',
    element: (
      <AdminRequireAuth>
        <LayoutAdmin />
      </AdminRequireAuth>
    ),
    children: [
      {
        index: true, // tương đương path: ''
        element: <Navigate to="/admin/dashboard" replace />
      },
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
        path: '403',
        element: <AccessDenied />
      },
      {
        path: '*',
        element: <Error404 path="/admin/dashboard" />
      }
    ]
  }
]
