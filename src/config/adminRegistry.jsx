import { lazy } from 'react'
import {
  ApiOutlined,
  AppstoreOutlined,
  BankOutlined,
  BellOutlined,
  CodeSandboxOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  ForkOutlined,
  HomeOutlined,
  MessageOutlined,
  RadiusSettingOutlined,
  RobotOutlined,
  SettingOutlined,
  StarOutlined,
  ToolOutlined,
  TeamOutlined
} from '@ant-design/icons'

const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminNotificationsPage = lazy(() => import('@/pages/admin/Notifications'))
const AdminProductsPages = lazy(() => import('@/pages/admin/Products'))
const AdminProductsDetails = lazy(() => import('@/pages/admin/Products/Details'))
const AdminProductsCreate = lazy(() => import('@/pages/admin/Products/Create'))
const AdminProductsEdit = lazy(() => import('@/pages/admin/Products/Edit'))
const AdminProductCategoriesPage = lazy(() => import('@/pages/admin/ProductCategories'))
const AdminProductCategoriesCreate = lazy(() => import('@/pages/admin/ProductCategories/Create'))
const AdminProductCategoriesEdit = lazy(() => import('@/pages/admin/ProductCategories/Edit'))
const AdminProductCategoriesDetails = lazy(() => import('@/pages/admin/ProductCategories/Details'))
const AdminRoles = lazy(() => import('@/pages/admin/Roles'))
const AdminPermissionsPage = lazy(() => import('@/pages/admin/Permissions'))
const AdminPermissionGroupsPage = lazy(() => import('@/pages/admin/PermissionGroups'))
const AdminRolePermissionPage = lazy(() => import('@/pages/admin/RolePermission'))
const AdminAccountsPage = lazy(() => import('@/pages/admin/Accounts'))
const AdminProfilePage = lazy(() => import('@/pages/admin/Profile'))
const AdminBankInfo = lazy(() => import('@/pages/admin/BankInfo'))
const AdminSettingsPage = lazy(() => import('@/pages/admin/Settings'))
const AdminPromoCodesPage = lazy(() => import('@/pages/admin/PromoCodes'))
const AdminOrdersPage = lazy(() => import('@/pages/admin/Orders'))
const AdminOrderDetail = lazy(() => import('@/pages/admin/Orders/Detail'))
const AdminPurchaseReceiptsPage = lazy(() => import('@/pages/admin/PurchaseReceipts'))
const AdminWidgetsPage = lazy(() => import('@/pages/admin/Widgets'))
const AdminBanners = lazy(() => import('@/pages/admin/Banners'))
const AdminAbout = lazy(() => import('@/pages/admin/About'))
const AdminBlog = lazy(() => import('@/pages/admin/Blog'))
const AdminBlogCreate = lazy(() => import('@/pages/admin/Blog/Create'))
const AdminBlogEdit = lazy(() => import('@/pages/admin/Blog/Edit'))
const AdminTermsPage = lazy(() => import('@/pages/admin/Terms'))
const AdminCooperationContactPage = lazy(() => import('@/pages/admin/CooperationContact'))
const AdminHomeWhyChooseUsPage = lazy(() => import('@/pages/admin/HomeWhyChooseUs'))
const AdminContactContent = lazy(() => import('@/pages/admin/ContactContent'))
const AdminPrivacyPolicyPage = lazy(() => import('@/pages/admin/PrivacyPolicy'))
const AdminReturnPolicyPage = lazy(() => import('@/pages/admin/ReturnPolicy'))
const AdminFaqPage = lazy(() => import('@/pages/admin/Faq'))
const AdminFooterPage = lazy(() => import('@/pages/admin/Footer'))
const AdminGameAccountPage = lazy(() => import('@/pages/admin/GameAccount'))
const AdminGameNewsPage = lazy(() => import('@/pages/admin/GameNews'))
const AdminVipPage = lazy(() => import('@/pages/admin/Vip'))
const AdminComingSoonPage = lazy(() => import('@/pages/admin/ComingSoon'))
const AdminFlashSalesPage = lazy(() => import('@/pages/admin/FlashSales'))
const AdminChat = lazy(() => import('@/pages/admin/Chat'))
const AdminQuickRepliesPage = lazy(() => import('@/pages/admin/QuickReplies'))
const AdminReviewsPage = lazy(() => import('@/pages/admin/Reviews'))
const AdminChatbotConfig = lazy(() => import('@/pages/admin/ChatbotConfig'))
const AdminChatbotRuntime = lazy(() => import('@/pages/admin/ChatbotRuntime'))
const AdminChatbotRulesPage = lazy(() => import('@/pages/admin/ChatbotRules'))
const AdminChatbotToolsPage = lazy(() => import('@/pages/admin/ChatbotTools'))
const AdminChatbotToolLogsPage = lazy(() => import('@/pages/admin/ChatbotToolLogs'))

const route = (path, Component, access = {}, options = {}) => ({
  path,
  Component,
  ...access,
  ...options
})

const menuRoute = (path, Component, access, labelKey, options = {}) => route(path, Component, access, {
  key: path,
  labelKey,
  menu: true,
  matchPaths: [path],
  ...options
})

const group = (key, labelKey, icon, children) => ({
  key,
  labelKey,
  icon,
  children
})

const pickMenuFields = item => ({
  key: item.key || item.path,
  labelKey: item.labelKey,
  icon: item.icon,
  permission: item.permission,
  permissions: item.permissions,
  requireAll: item.requireAll,
  matchPaths: item.matchPaths
})

const toMenuConfig = item => {
  if (item.children) {
    return {
      key: item.key,
      labelKey: item.labelKey,
      icon: item.icon,
      children: item.children.map(toMenuConfig).filter(Boolean)
    }
  }

  return item.menu ? pickMenuFields(item) : null
}

const flattenRoutes = items => items.flatMap(item => {
  if (item.children) return flattenRoutes(item.children)
  return [item, ...(item.relatedRoutes || [])]
})

export const adminRouteRegistry = [
  menuRoute('dashboard', AdminDashboard, { permission: 'view_dashboard' }, 'routes.dashboard', { icon: <HomeOutlined /> }),
  menuRoute('notifications', AdminNotificationsPage, { permission: 'view_notifications' }, 'routes.notifications', { icon: <BellOutlined /> }),
  group('products&categories', 'routes.products&categories', <AppstoreOutlined />, [
    menuRoute('products', AdminProductsPages, { permission: 'view_products' }, 'routes.products', {
      relatedRoutes: [
        route('products/details/:id', AdminProductsDetails, { permission: 'view_products' }),
        route('products/create', AdminProductsCreate, { permission: 'create_product' }),
        route('products/edit/:id', AdminProductsEdit, { permission: 'edit_product' })
      ]
    }),
    menuRoute('product-categories', AdminProductCategoriesPage, { permission: 'view_product_categories' }, 'routes.product-categories', {
      relatedRoutes: [
        route('product-categories/:id', AdminProductCategoriesDetails, { permission: 'view_product_categories' }),
        route('product-categories/create', AdminProductCategoriesCreate, { permission: 'create_product_category' }),
        route('product-categories/edit/:id', AdminProductCategoriesEdit, { permission: 'edit_product_category' })
      ]
    }),
    menuRoute('promo-codes', AdminPromoCodesPage, { permission: 'view_promo_codes' }, 'routes.promo-codes'),
    menuRoute('flash-sales', AdminFlashSalesPage, { permission: 'view_flashsales' }, 'routes.flash-sales'),
    menuRoute('purchase-receipts', AdminPurchaseReceiptsPage, { permission: 'edit_product' }, 'routes.purchase-receipts')
  ]),
  menuRoute('orders', AdminOrdersPage, { permission: 'view_orders' }, 'routes.orders', {
    icon: <CodeSandboxOutlined />,
    relatedRoutes: [
      route('orders/:id', AdminOrderDetail, { permission: 'view_orders' })
    ]
  }),
  group('info-layout', 'routes.info-layout', <RadiusSettingOutlined />, [
    menuRoute('banners', AdminBanners, { permission: 'view_banners' }, 'routes.banners'),
    menuRoute('widgets', AdminWidgetsPage, { permission: 'view_widgets' }, 'routes.widgets'),
    menuRoute('about', AdminAbout, { permission: 'view_about_content' }, 'routes.about'),
    menuRoute('blog', AdminBlog, { permission: 'view_blog' }, 'routes.blog', {
      relatedRoutes: [
        route('blog/create', AdminBlogCreate, { permission: 'create_blog' }),
        route('blog/edit/:id', AdminBlogEdit, { permission: 'edit_blog' })
      ]
    }),
    menuRoute('terms', AdminTermsPage, { permission: 'view_terms_content' }, 'routes.terms'),
    menuRoute('home-why-choose-us', AdminHomeWhyChooseUsPage, { permission: 'view_home_why_choose_us_content' }, 'routes.home-why-choose-us'),
    menuRoute('cooperation-contact', AdminCooperationContactPage, { permission: 'view_cooperation_contact_content' }, 'routes.cooperation-contact'),
    menuRoute('contact-page', AdminContactContent, { permission: 'view_contact_page' }, 'routes.contact-page'),
    menuRoute('privacy-policy', AdminPrivacyPolicyPage, { permission: 'view_privacy_policy' }, 'routes.privacy-policy'),
    menuRoute('return-policy', AdminReturnPolicyPage, { permission: 'view_return_policy' }, 'routes.return-policy'),
    menuRoute('faq', AdminFaqPage, { permission: 'view_faq' }, 'routes.faq'),
    menuRoute('footer', AdminFooterPage, { permission: 'view_footer_content' }, 'routes.footer'),
    menuRoute('game-account', AdminGameAccountPage, { permission: 'view_game_account_content' }, 'routes.game-account'),
    menuRoute('game-news', AdminGameNewsPage, { permission: 'view_game_news_content' }, 'routes.game-news'),
    menuRoute('vip', AdminVipPage, { permission: 'view_vip_content' }, 'routes.vip'),
    menuRoute('community', AdminComingSoonPage, { permission: 'view_coming_soon_content' }, 'routes.community'),
    menuRoute('quick-support', AdminComingSoonPage, { permission: 'view_coming_soon_content' }, 'routes.quick-support'),
    menuRoute('license', AdminComingSoonPage, { permission: 'view_coming_soon_content' }, 'routes.license')
  ]),
  group('roles&permission', 'routes.roles&permission', <ForkOutlined />, [
    menuRoute('permission-groups', AdminPermissionGroupsPage, { permission: 'view_permission_groups' }, 'routes.permission-groups'),
    menuRoute('permissions', AdminPermissionsPage, { permission: 'view_permissions' }, 'routes.permissions'),
    menuRoute('roles', AdminRoles, { permission: 'view_roles' }, 'routes.roles'),
    menuRoute('role-permission', AdminRolePermissionPage, {
      permissions: ['view_roles', 'view_permissions', 'view_permission_groups', 'view_role_permission']
    }, 'routes.role-permission')
  ]),
  menuRoute('accounts', AdminAccountsPage, { permission: 'view_accounts' }, 'routes.accounts', { icon: <TeamOutlined /> }),
  route('profile', AdminProfilePage),
  menuRoute('bank-info', AdminBankInfo, { permission: 'view_bank_info' }, 'routes.bank-info', { icon: <BankOutlined /> }),
  route('settings', AdminSettingsPage),
  menuRoute('reviews', AdminReviewsPage, { permission: 'view_reviews' }, 'routes.reviews', { icon: <StarOutlined /> }),
  group('live-chat', 'routes.live-chat', <MessageOutlined />, [
    menuRoute('chat', AdminChat, { permission: 'view_live_chat' }, 'routes.chat'),
    menuRoute('live-chat/quick-replies', AdminQuickRepliesPage, { permission: 'view_quick_replies' }, 'routes.quick-replies')
  ]),
  group('ai-agent', 'routes.ai-agent', <RobotOutlined />, [
    menuRoute('chatbot-config', AdminChatbotConfig, { permission: 'view_chatbot_config' }, 'routes.chatbot-config', { icon: <SettingOutlined /> }),
    menuRoute('chatbot-runtime', AdminChatbotRuntime, { permission: 'view_chatbot_config' }, 'routes.chatbot-runtime', { icon: <ApiOutlined /> }),
    menuRoute('chatbot-rules', AdminChatbotRulesPage, { permission: 'view_chatbot_config' }, 'routes.chatbot-rules', { icon: <FileTextOutlined /> }),
    menuRoute('chatbot-tools', AdminChatbotToolsPage, { permission: 'view_chatbot_config' }, 'routes.chatbot-tools', { icon: <ToolOutlined /> }),
    menuRoute('chatbot-tool-logs', AdminChatbotToolLogsPage, { permission: 'view_chatbot_tool_logs' }, 'routes.chatbot-tool-logs', { icon: <FileSearchOutlined /> })
  ])
]

export const adminPageRoutes = flattenRoutes(adminRouteRegistry)
export const adminMenuConfig = adminRouteRegistry.map(toMenuConfig).filter(Boolean)
