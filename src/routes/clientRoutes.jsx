import ClientLayout from '@/layouts/client'
import Home from '@/pages/client/Home'
import Products from '@/pages/client/Products'
import About from '@/pages/client/About'
import Contact from '@/pages/client/Contact'
import Blog from '@/pages/client/Blog'
import BlogDetail from '@/pages/client/Blog/Detail'
import Error404 from '@/pages/client/Error404'
import Detail from '@/pages/client/Products/Detail'
import Profile from '@/pages/client/Profile'
import CartPage from '@/pages/client/Cart'
import Checkout from '@/pages/client/Checkout'
import OrderSuccess from '@/pages/client/Orders/Success'
import Orders from '@/pages/client/Orders'
import OrderDetail from '@/pages/client/Orders/Detail'
import RequireAuth from '@/components/route/RequireAuth'
import FlashSale from '@/pages/client/FlashSale'
import ShoppingGuide from '@/pages/client/ShoppingGuide'
import CouponsPage from '@/pages/client/Coupons'
import PrivacyPolicy from '@/pages/client/PrivacyPolicy'
import ReturnPolicy from '@/pages/client/ReturnPolicy'
import FAQPage from '@/pages/client/FAQ'
import TermsOfService from '@/pages/client/TermsOfService'
import CooperationContactPage from '@/pages/client/CooperationContact'
import GameAccountComingSoon from '@/pages/client/GameAccountComingSoon'
import SpecialPackageComingSoon from '@/pages/client/SpecialPackageComingSoon'
import ProductCategoryPage from '@/pages/client/ProductCategory'
import GameNewsComingSoon from '@/pages/client/GameNewsComingSoon'
import Vip from '@/pages/client/VipComingSoon'
import CommunityComingSoon from '@/pages/client/CommunityComingSoon'
import QuickSupportComingSoon from '@/pages/client/QuickSupportComingSoon'
import LicenseComingSoon from '@/pages/client/LicenseComingSoon'
import SettingsPage from '@/pages/client/Settings'
import Wishlist from '@/pages/client/Wishlist'
import ComparePage from '@/pages/client/Compare'
import Notifications from '@/pages/client/Notifications'

export const clientRoutes = [
  {
    path: '/',
    element: <ClientLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/products', element: <Products /> },
      { path: '/compare', element: <ComparePage /> },
      { path: '/products/:slug', element: <Detail /> },
      { path: '/product-categories/:slug', element: <ProductCategoryPage /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/blog', element: <Blog /> },
      { path: '/blog/:slug', element: <BlogDetail /> },
      {
        path: '/user/profile',
        element: (
          <RequireAuth>
            <Profile />
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
            <Checkout />
          </RequireAuth>
        )
      },
      {
        path: '/order-success',
        element: (
          <RequireAuth>
            <OrderSuccess />
          </RequireAuth>
        )
      },
      {
        path: '/orders',
        element: (
          <RequireAuth>
            <Orders />
          </RequireAuth>
        )
      },
      {
        path: '/notifications',
        element: (
          <RequireAuth>
            <Notifications />
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
            <Wishlist />
          </RequireAuth>
        )
      },
      {
        path: '/orders/:id',
        element: (
          <RequireAuth>
            <OrderDetail />
          </RequireAuth>
        )
      },
      { path: '/flash-sale', element: <FlashSale /> },
      { path: '/shopping-guide', element: <ShoppingGuide /> },
      {
        path: '/coupons',
        element: (
          <RequireAuth>
            <CouponsPage />
          </RequireAuth>
        )
      },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/return-policy', element: <ReturnPolicy /> },
      { path: '/faq', element: <FAQPage /> },
      { path: '/terms-of-service', element: <TermsOfService /> },
      { path: '/cooperation-contact', element: <CooperationContactPage /> },
      { path: '/game-account', element: <GameAccountComingSoon /> },
      { path: '/special-package', element: <SpecialPackageComingSoon /> },
      { path: '/game-news', element: <GameNewsComingSoon /> },
      { path: '/vip', element: <Vip /> },
      { path: '/community', element: <CommunityComingSoon /> },
      { path: '/quick-support', element: <QuickSupportComingSoon /> },
      { path: '/license', element: <LicenseComingSoon /> },
      { path: '*', element: <Error404 path="/" /> }
    ]
  }
]
