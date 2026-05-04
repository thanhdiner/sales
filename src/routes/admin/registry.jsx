import {
  ApiOutlined,
  AppstoreOutlined,
  BankOutlined,
  BellOutlined,
  CodeSandboxOutlined,
  ContactsOutlined,
  CustomerServiceOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  ForkOutlined,
  GiftOutlined,
  KeyOutlined,
  GlobalOutlined,
  HomeOutlined,
  IdcardOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  NotificationOutlined,
  PercentageOutlined,
  PictureOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  RadiusSettingOutlined,
  ReadOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ShoppingOutlined,
  SolutionOutlined,
  StarOutlined,
  TagsOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  TrophyOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons'
import { group, menuRoute, route } from './helpers'
import {
  AdminAbout,
  AdminAccountsPage,
  AdminBankInfo,
  AdminBanners,
  AdminBlog,
  AdminBlogCategoriesPage,
  AdminBlogCreate,
  AdminBlogDetailTemplate,
  AdminBlogEdit,
  AdminBlogPageBuilder,
  AdminBlogTagsPage,
  AdminChat,
  AdminChatbotConfig,
  AdminChatbotRulesPage,
  AdminChatbotRuntime,
  AdminChatbotToolLogsPage,
  AdminChatbotToolsPage,
  AdminComingSoonPage,
  AdminContactContent,
  AdminCooperationContactPage,
  AdminDashboard,
  AdminFaqPage,
  AdminFlashSalesPage,
  AdminFooterPage,
  AdminGameAccountPage,
  AdminGameNewsPage,
  AdminHomeWhyChooseUsPage,
  AdminMediaLibraryPage,
  AdminNotificationsPage,
  AdminOrderDetail,
  AdminOrdersPage,
  AdminPermissionsPage,
  AdminPermissionGroupsPage,
  AdminPrivacyPolicyPage,
  AdminProductCategoriesCreate,
  AdminProductCategoriesDetails,
  AdminProductCategoriesEdit,
  AdminProductCategoriesPage,
  AdminProductsCreate,
  AdminProductsDetails,
  AdminProductsEdit,
  AdminProductsPages,
  AdminProfilePage,
  AdminPromoCodesPage,
  AdminPurchaseReceiptsPage,
  AdminQuickRepliesPage,
  AdminReturnPolicyPage,
  AdminReviewsPage,
  AdminRolePermissionPage,
  AdminRoles,
  AdminSettingsPage,
  AdminTermsPage,
  AdminVipPage,
  AdminWidgetsPage
} from './pages'

export const adminRouteRegistry = [
  menuRoute('dashboard', AdminDashboard, { permission: 'view_dashboard' }, 'routes.dashboard', { icon: <HomeOutlined /> }),
  menuRoute('notifications', AdminNotificationsPage, { permission: 'view_notifications' }, 'routes.notifications', { icon: <BellOutlined /> }),
  group('products&categories', 'routes.products&categories', <AppstoreOutlined />, [
    menuRoute('products', AdminProductsPages, { permission: 'view_products' }, 'routes.products', {
      icon: <ShoppingOutlined />,
      relatedRoutes: [
        route('products/details/:id', AdminProductsDetails, { permission: 'view_products' }),
        route('products/create', AdminProductsCreate, { permission: 'create_product' }),
        route('products/edit/:id', AdminProductsEdit, { permission: 'edit_product' })
      ]
    }),
    menuRoute('product-categories', AdminProductCategoriesPage, { permission: 'view_product_categories' }, 'routes.product-categories', {
      icon: <TagsOutlined />,
      relatedRoutes: [
        route('product-categories/:id', AdminProductCategoriesDetails, { permission: 'view_product_categories' }),
        route('product-categories/create', AdminProductCategoriesCreate, { permission: 'create_product_category' }),
        route('product-categories/edit/:id', AdminProductCategoriesEdit, { permission: 'edit_product_category' })
      ]
    }),
    menuRoute('promo-codes', AdminPromoCodesPage, { permission: 'view_promo_codes' }, 'routes.promo-codes', { icon: <PercentageOutlined /> }),
    menuRoute('flash-sales', AdminFlashSalesPage, { permission: 'view_flashsales' }, 'routes.flash-sales', { icon: <ThunderboltOutlined /> }),
    menuRoute('purchase-receipts', AdminPurchaseReceiptsPage, { permission: 'edit_product' }, 'routes.purchase-receipts', { icon: <ProfileOutlined /> })
  ]),
  menuRoute('orders', AdminOrdersPage, { permission: 'view_orders' }, 'routes.orders', {
    icon: <CodeSandboxOutlined />,
    relatedRoutes: [
      route('orders/:id', AdminOrderDetail, { permission: 'view_orders' })
    ]
  }),
  group('info-layout', 'routes.info-layout', <RadiusSettingOutlined />, [
    menuRoute('banners', AdminBanners, { permission: 'view_banners' }, 'routes.banners', { icon: <PictureOutlined /> }),
    menuRoute('widgets', AdminWidgetsPage, { permission: 'view_widgets' }, 'routes.widgets', { icon: <AppstoreOutlined /> }),
    menuRoute('about', AdminAbout, { permission: 'view_about_content' }, 'routes.about', { icon: <InfoCircleOutlined /> }),
    menuRoute('blog', AdminBlog, { permission: 'view_blog' }, 'routes.blog', {
      icon: <ReadOutlined />,
      relatedRoutes: [
        route('blog/create', AdminBlogCreate, { permission: 'create_blog' }),
        route('blog/edit/:id', AdminBlogEdit, { permission: 'edit_blog' }),
        route('blog/page-builder', AdminBlogPageBuilder, { permission: 'edit_blog' }, { shell: false }),
        route('blog/detail-template', AdminBlogDetailTemplate, { permission: 'edit_blog' }),
        route('blog-categories', AdminBlogCategoriesPage, { permission: 'edit_blog' }),
        route('blog-tags', AdminBlogTagsPage, { permission: 'edit_blog' }),
        route('media-library', AdminMediaLibraryPage, { permission: 'edit_blog' })
      ]
    }),
    menuRoute('terms', AdminTermsPage, { permission: 'view_terms_content' }, 'routes.terms', { icon: <FileTextOutlined /> }),
    menuRoute('home-why-choose-us', AdminHomeWhyChooseUsPage, { permission: 'view_home_why_choose_us_content' }, 'routes.home-why-choose-us', { icon: <TrophyOutlined /> }),
    menuRoute('cooperation-contact', AdminCooperationContactPage, { permission: 'view_cooperation_contact_content' }, 'routes.cooperation-contact', { icon: <UsergroupAddOutlined /> }),
    menuRoute('contact-page', AdminContactContent, { permission: 'view_contact_page' }, 'routes.contact-page', { icon: <ContactsOutlined /> }),
    menuRoute('privacy-policy', AdminPrivacyPolicyPage, { permission: 'view_privacy_policy' }, 'routes.privacy-policy', { icon: <SafetyCertificateOutlined /> }),
    menuRoute('return-policy', AdminReturnPolicyPage, { permission: 'view_return_policy' }, 'routes.return-policy', { icon: <FileProtectOutlined /> }),
    menuRoute('faq', AdminFaqPage, { permission: 'view_faq' }, 'routes.faq', { icon: <QuestionCircleOutlined /> }),
    menuRoute('footer', AdminFooterPage, { permission: 'view_footer_content' }, 'routes.footer', { icon: <GlobalOutlined /> }),
    menuRoute('game-account', AdminGameAccountPage, { permission: 'view_game_account_content' }, 'routes.game-account', { icon: <IdcardOutlined /> }),
    menuRoute('game-news', AdminGameNewsPage, { permission: 'view_game_news_content' }, 'routes.game-news', { icon: <ProfileOutlined /> }),
    menuRoute('vip', AdminVipPage, { permission: 'view_vip_content' }, 'routes.vip', { icon: <GiftOutlined /> }),
    menuRoute('community', AdminComingSoonPage, { permission: 'view_coming_soon_content' }, 'routes.community', { icon: <MessageOutlined /> }),
    menuRoute('quick-support', AdminComingSoonPage, { permission: 'view_coming_soon_content' }, 'routes.quick-support', { icon: <CustomerServiceOutlined /> }),
    menuRoute('license', AdminComingSoonPage, { permission: 'view_coming_soon_content' }, 'routes.license', { icon: <SafetyCertificateOutlined /> })
  ]),
  group('roles&permission', 'routes.roles&permission', <ForkOutlined />, [
    menuRoute('permission-groups', AdminPermissionGroupsPage, { permission: 'view_permission_groups' }, 'routes.permission-groups', { icon: <SolutionOutlined /> }),
    menuRoute('permissions', AdminPermissionsPage, { permission: 'view_permissions' }, 'routes.permissions', { icon: <KeyOutlined /> }),
    menuRoute('roles', AdminRoles, { permission: 'view_roles' }, 'routes.roles', { icon: <TeamOutlined /> }),
    menuRoute('role-permission', AdminRolePermissionPage, {
      permissions: ['view_roles', 'view_permissions', 'view_permission_groups', 'view_role_permission']
    }, 'routes.role-permission', { icon: <SafetyCertificateOutlined /> })
  ]),
  menuRoute('accounts', AdminAccountsPage, { permission: 'view_accounts' }, 'routes.accounts', { icon: <TeamOutlined /> }),
  route('profile', AdminProfilePage),
  menuRoute('bank-info', AdminBankInfo, { permission: 'view_bank_info' }, 'routes.bank-info', { icon: <BankOutlined /> }),
  route('settings', AdminSettingsPage),
  menuRoute('reviews', AdminReviewsPage, { permission: 'view_reviews' }, 'routes.reviews', { icon: <StarOutlined /> }),
  group('live-chat', 'routes.live-chat', <MessageOutlined />, [
    menuRoute('chat', AdminChat, { permission: 'view_live_chat' }, 'routes.chat', { icon: <MessageOutlined /> }),
    menuRoute('live-chat/quick-replies', AdminQuickRepliesPage, { permission: 'view_quick_replies' }, 'routes.quick-replies', { icon: <NotificationOutlined /> })
  ]),
  group('ai-agent', 'routes.ai-agent', <RobotOutlined />, [
    menuRoute('chatbot-config', AdminChatbotConfig, { permission: 'view_chatbot_config' }, 'routes.chatbot-config', { icon: <SettingOutlined /> }),
    menuRoute('chatbot-runtime', AdminChatbotRuntime, { permission: 'view_chatbot_config' }, 'routes.chatbot-runtime', { icon: <ApiOutlined /> }),
    menuRoute('chatbot-rules', AdminChatbotRulesPage, { permission: 'view_chatbot_config' }, 'routes.chatbot-rules', { icon: <FileTextOutlined /> }),
    menuRoute('chatbot-tools', AdminChatbotToolsPage, { permission: 'view_chatbot_config' }, 'routes.chatbot-tools', { icon: <ToolOutlined /> }),
    menuRoute('chatbot-tool-logs', AdminChatbotToolLogsPage, { permission: 'view_chatbot_tool_logs' }, 'routes.chatbot-tool-logs', { icon: <FileSearchOutlined /> })
  ])
]
