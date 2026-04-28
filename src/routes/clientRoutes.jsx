import LayoutDefault from '../Layout/LayoutDefault'
import Home from '@/pages/Home'
import ProductsPages from '@/pages/ProductsPages'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Blog from '@/pages/Blog'
import Error404 from '@/pages/Error404'
import ProductsDetail from '@/pages/ProductsPages/ProductsDetail'
import ProfilePage from '@/pages/ProfilePage'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import OrderSuccessPage from '@/pages/OrderSuccessPage'
import OrdersPage from '@/pages/OrdersPage'
import OrderDetailPage from '@/pages/OrderDetailPage'
import RequireAuth from '@/components/RequireAuth'
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
import VipPage from '@/pages/VipComingSoon'
import CommunityComingSoon from '@/pages/CommunityComingSoon'
import QuickSupportComingSoon from '@/pages/QuickSupportComingSoon'
import LicenseComingSoon from '@/pages/LicenseComingSoon'
import SettingsPage from '@/pages/SettingsPage'
import WishlistPage from '@/pages/WishlistPage'
import ComparePage from '@/pages/ComparePage'
import NotificationsPage from '@/pages/NotificationsPage'

export const clientRoutes = [
  {
    path: '/',
    element: <LayoutDefault />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/products', element: <ProductsPages /> },
      { path: '/compare', element: <ComparePage /> },
      { path: '/products/:slug', element: <ProductsDetail /> },
      { path: '/product-categories/:slug', element: <ProductCategoryPage /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/blog', element: <Blog /> },
      {
        path: '/user/profile',
        element: (
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        )
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
        path: '/notifications',
        element: (
          <RequireAuth>
            <NotificationsPage />
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
      { path: '/flash-sale', element: <FlashSalePage /> },
      { path: '/shopping-guide', element: <ShoppingGuide /> },
      {
        path: '/coupons',
        element: (
          <RequireAuth>
            <CouponsPage />
          </RequireAuth>
        )
      },
      { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
      { path: '/return-policy', element: <ReturnPolicyPage /> },
      { path: '/faq', element: <FAQPage /> },
      { path: '/terms-of-service', element: <TermsOfServicePage /> },
      { path: '/cooperation-contact', element: <CooperationContactPage /> },
      { path: '/game-account', element: <GameAccountComingSoon /> },
      { path: '/special-package', element: <SpecialPackageComingSoon /> },
      { path: '/game-news', element: <GameNewsComingSoon /> },
      { path: '/vip', element: <VipPage /> },
      { path: '/community', element: <CommunityComingSoon /> },
      { path: '/quick-support', element: <QuickSupportComingSoon /> },
      { path: '/license', element: <LicenseComingSoon /> },
      { path: '*', element: <Error404 path="/" /> }
    ]
  }
]
