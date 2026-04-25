import {
  ApiOutlined,
  AppstoreOutlined,
  BankOutlined,
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
  { label: 'Dashboard', key: 'dashboard', icon: <HomeOutlined /> },
  {
    label: 'Products & Categories',
    key: 'products&categories',
    icon: <AppstoreOutlined />,
    children: [
      { label: 'Products', key: 'products', permission: 'view_products', matchPaths: ['products'] },
      { label: 'Categories', key: 'product-categories', permission: 'view_product_categories', matchPaths: ['product-categories'] },
      { label: 'Promo Codes', key: 'promo-codes', permission: 'view_promo_codes', matchPaths: ['promo-codes'] },
      { label: 'Flash Sales', key: 'flash-sales', permission: 'view_flashsales', matchPaths: ['flash-sales'] },
      { label: 'Purchase Receipts', key: 'purchase-receipts', permission: 'edit_product', matchPaths: ['purchase-receipts'] }
    ]
  },
  { label: 'Orders', key: 'orders', icon: <CodeSandboxOutlined />, permission: 'view_orders', matchPaths: ['orders'] },
  {
    label: 'Info Layout',
    key: 'info-layout',
    icon: <RadiusSettingOutlined />,
    children: [
      { label: 'Banners', key: 'banners', permission: 'view_banners', matchPaths: ['banners'] },
      { label: 'Widgets', key: 'widgets', permission: 'view_widgets', matchPaths: ['widgets'] }
    ]
  },
  {
    label: 'Roles & Permissions',
    key: 'roles&permission',
    icon: <ForkOutlined />,
    children: [
      { label: 'Permission Groups', key: 'permission-groups', permission: 'view_permission_groups', matchPaths: ['permission-groups'] },
      { label: 'Permissions', key: 'permissions', permission: 'view_permissions', matchPaths: ['permissions'] },
      { label: 'Roles', key: 'roles', permission: 'view_roles', matchPaths: ['roles'] },
      {
        label: 'Role Permission',
        key: 'role-permission',
        permissions: ['view_roles', 'view_permissions', 'view_permission_groups', 'view_role_permission'],
        matchPaths: ['role-permission']
      }
    ]
  },
  { label: 'Accounts', key: 'accounts', icon: <TeamOutlined />, permission: 'view_accounts', matchPaths: ['accounts'] },
  { label: 'Bank Info', key: 'bank-info', icon: <BankOutlined />, permission: 'view_bank_info', matchPaths: ['bank-info'] },
  { label: 'Reviews', key: 'reviews', icon: <StarOutlined />, matchPaths: ['reviews'] },
  { label: 'Live Chat', key: 'chat', icon: <MessageOutlined />, matchPaths: ['chat'] },
  {
    label: 'AI',
    key: 'ai-agent',
    icon: <RobotOutlined />,
    children: [
      { label: 'Agent Settings', key: 'chatbot-config', icon: <SettingOutlined />, matchPaths: ['chatbot-config'] },
      { label: 'Runtime & Provider', key: 'chatbot-runtime', icon: <ApiOutlined />, matchPaths: ['chatbot-runtime'] },
      { label: 'Agent Rules', key: 'chatbot-rules', icon: <FileTextOutlined />, matchPaths: ['chatbot-rules'] },
      { label: 'Agent Tools', key: 'chatbot-tools', icon: <ToolOutlined />, matchPaths: ['chatbot-tools'] },
      { label: 'Tool Call Logs', key: 'chatbot-tool-logs', icon: <FileSearchOutlined />, matchPaths: ['chatbot-tool-logs'] }
    ]
  }
]
