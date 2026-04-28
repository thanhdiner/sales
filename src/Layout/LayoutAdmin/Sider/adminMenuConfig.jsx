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

export const adminMenuConfig = [
  { labelKey: 'routes.dashboard', key: 'dashboard', icon: <HomeOutlined /> },
  { labelKey: 'routes.notifications', key: 'notifications', icon: <BellOutlined />, matchPaths: ['notifications'] },
  {
    labelKey: 'routes.products&categories',
    key: 'products&categories',
    icon: <AppstoreOutlined />,
    children: [
      { labelKey: 'routes.products', key: 'products', permission: 'view_products', matchPaths: ['products'] },
      { labelKey: 'routes.product-categories', key: 'product-categories', permission: 'view_product_categories', matchPaths: ['product-categories'] },
      { labelKey: 'routes.promo-codes', key: 'promo-codes', permission: 'view_promo_codes', matchPaths: ['promo-codes'] },
      { labelKey: 'routes.flash-sales', key: 'flash-sales', permission: 'view_flashsales', matchPaths: ['flash-sales'] },
      { labelKey: 'routes.purchase-receipts', key: 'purchase-receipts', permission: 'edit_product', matchPaths: ['purchase-receipts'] }
    ]
  },
  { labelKey: 'routes.orders', key: 'orders', icon: <CodeSandboxOutlined />, permission: 'view_orders', matchPaths: ['orders'] },
  {
    labelKey: 'routes.info-layout',
    key: 'info-layout',
    icon: <RadiusSettingOutlined />,
    children: [
      { labelKey: 'routes.banners', key: 'banners', permission: 'view_banners', matchPaths: ['banners'] },
      { labelKey: 'routes.widgets', key: 'widgets', permission: 'view_widgets', matchPaths: ['widgets'] },
      { labelKey: 'routes.about', key: 'about', matchPaths: ['about'] },
      { labelKey: 'routes.blog', key: 'blog', matchPaths: ['blog'] },
      { labelKey: 'routes.terms', key: 'terms', matchPaths: ['terms'] },
      { labelKey: 'routes.home-why-choose-us', key: 'home-why-choose-us', matchPaths: ['home-why-choose-us'] },
      { labelKey: 'routes.cooperation-contact', key: 'cooperation-contact', matchPaths: ['cooperation-contact'] },
      { labelKey: 'routes.contact-page', key: 'contact-page', matchPaths: ['contact-page'] },
      { labelKey: 'routes.privacy-policy', key: 'privacy-policy', matchPaths: ['privacy-policy'] },
      { labelKey: 'routes.return-policy', key: 'return-policy', matchPaths: ['return-policy'] },
      { labelKey: 'routes.faq', key: 'faq', matchPaths: ['faq'] },
      { labelKey: 'routes.footer', key: 'footer', matchPaths: ['footer'] },
      { labelKey: 'routes.game-account', key: 'game-account', matchPaths: ['game-account'] },
      { labelKey: 'routes.game-news', key: 'game-news', matchPaths: ['game-news'] },
      { labelKey: 'routes.vip', key: 'vip', matchPaths: ['vip'] },
      { labelKey: 'routes.community', key: 'community', matchPaths: ['community'] },
      { labelKey: 'routes.quick-support', key: 'quick-support', matchPaths: ['quick-support'] },
      { labelKey: 'routes.license', key: 'license', matchPaths: ['license'] }
    ]
  },
  {
    labelKey: 'routes.roles&permission',
    key: 'roles&permission',
    icon: <ForkOutlined />,
    children: [
      { labelKey: 'routes.permission-groups', key: 'permission-groups', permission: 'view_permission_groups', matchPaths: ['permission-groups'] },
      { labelKey: 'routes.permissions', key: 'permissions', permission: 'view_permissions', matchPaths: ['permissions'] },
      { labelKey: 'routes.roles', key: 'roles', permission: 'view_roles', matchPaths: ['roles'] },
      {
        labelKey: 'routes.role-permission',
        key: 'role-permission',
        permissions: ['view_roles', 'view_permissions', 'view_permission_groups', 'view_role_permission'],
        matchPaths: ['role-permission']
      }
    ]
  },
  { labelKey: 'routes.accounts', key: 'accounts', icon: <TeamOutlined />, permission: 'view_accounts', matchPaths: ['accounts'] },
  { labelKey: 'routes.bank-info', key: 'bank-info', icon: <BankOutlined />, permission: 'view_bank_info', matchPaths: ['bank-info'] },
  { labelKey: 'routes.reviews', key: 'reviews', icon: <StarOutlined />, matchPaths: ['reviews'] },
  {
    labelKey: 'routes.live-chat',
    key: 'live-chat',
    icon: <MessageOutlined />,
    children: [
      { labelKey: 'routes.chat', key: 'chat', matchPaths: ['chat'] },
      { labelKey: 'routes.quick-replies', key: 'live-chat/quick-replies', matchPaths: ['live-chat/quick-replies'] }
    ]
  },
  {
    labelKey: 'routes.ai-agent',
    key: 'ai-agent',
    icon: <RobotOutlined />,
    children: [
      { labelKey: 'routes.chatbot-config', key: 'chatbot-config', icon: <SettingOutlined />, matchPaths: ['chatbot-config'] },
      { labelKey: 'routes.chatbot-runtime', key: 'chatbot-runtime', icon: <ApiOutlined />, matchPaths: ['chatbot-runtime'] },
      { labelKey: 'routes.chatbot-rules', key: 'chatbot-rules', icon: <FileTextOutlined />, matchPaths: ['chatbot-rules'] },
      { labelKey: 'routes.chatbot-tools', key: 'chatbot-tools', icon: <ToolOutlined />, matchPaths: ['chatbot-tools'] },
      { labelKey: 'routes.chatbot-tool-logs', key: 'chatbot-tool-logs', icon: <FileSearchOutlined />, matchPaths: ['chatbot-tool-logs'] }
    ]
  }
]
