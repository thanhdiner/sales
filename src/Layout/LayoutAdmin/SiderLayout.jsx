import {
  AppstoreOutlined,
  BankOutlined,
  CodeSandboxOutlined,
  ForkOutlined,
  HomeOutlined,
  MessageOutlined,
  RadiusSettingOutlined,
  TeamOutlined
} from '@ant-design/icons'
import { Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { filterMenuChildren } from '@/utils/filterMenuChildren'
import { hasAllPermissions } from '@/utils/hasAllPermissions'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import { useSelector } from 'react-redux'

function SiderLayout({ collapsed, setCollapsed, location }) {
  const navigate = useNavigate()
  const [stateOpenKeys, setStateOpenKeys] = useState([])
  const permissions = useAdminPermissions()

  const websiteConfig = useSelector(state => state.websiteConfig.data)

  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label
    }
  }

  const canViewRolePermission = hasAllPermissions(permissions, [
    'view_roles',
    'view_permissions',
    'view_permission_groups',
    'view_role_permission'
  ])

  const menuItems = [
    getItem('Dashboard', 'dashboard', <HomeOutlined />),
    filterMenuChildren(
      getItem('Products & Categories', 'products&categories', <AppstoreOutlined />, [
        permissions.includes('view_products') && getItem('Products', 'products'),
        permissions.includes('view_product_categories') && getItem('Categories', 'product-categories'),
        permissions.includes('view_promo_codes') && getItem('Promo Codes', 'promo-codes'),
        permissions.includes('view_flashsales') && getItem('Flash Sales', 'flash-sales')
      ])
    ),
    permissions.includes('view_orders') && getItem('Orders', 'orders', <CodeSandboxOutlined />),
    filterMenuChildren(
      getItem('Info Layout', 'info-layout', <RadiusSettingOutlined />, [
        permissions.includes('view_banners') && getItem('Banners', 'banners'),
        permissions.includes('view_widgets') && getItem('Widgets', 'widgets')
      ])
    ),
    filterMenuChildren(
      getItem('Roles & Permissions', 'roles&permission', <ForkOutlined />, [
        permissions.includes('view_permission_groups') && getItem('Permission Groups', 'permission-groups'),
        permissions.includes('view_permissions') && getItem('Permissions', 'permissions'),
        permissions.includes('view_roles') && getItem('Roles', 'roles'),
        canViewRolePermission && getItem('Role Permission', 'role-permission')
      ])
    ),
    permissions.includes('view_accounts') && getItem('Accounts', 'accounts', <TeamOutlined />),
    permissions.includes('view_bank_info') && getItem('Bank Info', 'bank-info', <BankOutlined />),
    getItem('Live Chat', 'chat', <MessageOutlined />)
  ]

  const getLevelKeys = items1 => {
    const key = {}
    const func = (items2, level = 1) => {
      items2.forEach(item => {
        if (item.key) key[item.key] = level
        if (item.children) func(item.children, level + 1)
      })
    }
    func(items1)
    return key
  }
  const levelKeys = getLevelKeys(menuItems)

  useEffect(() => {
    const openKeys = []
    menuItems.forEach(item => {
      if (item.children) {
        item.children.forEach(subItem => {
          if (location.pathname.includes(subItem.key)) openKeys.push(item.key)
        })
      }
    })
    setStateOpenKeys(openKeys)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const onOpenChange = openKeys => {
    const currentOpenKey = openKeys.find(key => stateOpenKeys.indexOf(key) === -1)
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys.filter(key => key !== currentOpenKey).findIndex(key => levelKeys[key] === levelKeys[currentOpenKey])
      setStateOpenKeys(openKeys.filter((_, index) => index !== repeatIndex).filter(key => levelKeys[key] <= levelKeys[currentOpenKey]))
    } else setStateOpenKeys(openKeys)
  }

  const getSelectedKey = pathname => {
    if (pathname.includes('/admin/products')) return 'products'
    if (pathname.includes('/admin/product-categories')) return 'product-categories'
    if (pathname.includes('/admin/promo-codes')) return 'promo-codes'
    if (pathname.includes('/admin/permissions')) return 'permissions'
    if (pathname.includes('/admin/roles')) return 'roles'
    if (pathname.includes('/admin/permission-groups')) return 'permission-groups'
    if (pathname.includes('/admin/role-permission')) return 'role-permission'
    if (pathname.includes('/admin/accounts')) return 'accounts'
    if (pathname.includes('/admin/orders')) return 'orders'
    if (pathname.includes('/admin/banners')) return 'banners'
    if (pathname.includes('/admin/widgets')) return 'widgets'
    if (pathname.includes('/admin/flash-sales')) return 'flash-sales'
    if (pathname.includes('/admin/bank-info')) return 'bank-info'
    if (pathname.includes('/admin/chat')) return 'chat'
    return 'dashboard'
  }

  // Auto close menu on small screens when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCollapsed(true)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setCollapsed])

  useEffect(() => {
    if (window.innerWidth < 768) setCollapsed(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <Sider
      theme="light"
      width="235px"
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={`h-screen flex flex-col z-30 bg-white dark:bg-gray-800 transition-all ease-in-out duration-300
      md:sticky md:top-0 md:left-0
      fixed top-0 left-0 ${collapsed ? '-translate-x-full' : 'translate-x-0'} md:translate-x-0 shadow-lg md:shadow-none`}
    >
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 px-3">
        <Link to={'/admin/dashboard'}>
          <div className={`flex items-center h-16 overflow-hidden transition-all duration-700 ease-in-out`}>
            <div className={`flex-shrink-0 transition-all duration-700 ${collapsed ? 'pl-2' : 'pl-4'}`}>
              <img
                src={websiteConfig?.logoUrl}
                alt={websiteConfig?.siteName || 'Logo'}
                className="w-10 h-10 bg-white rounded-sm shadow-sm object-contain"
              />
            </div>
            <span
              className={
                `ml-2 text-2xl font-semibold text-black dark:text-white whitespace-nowrap
     transition-all duration-500 ease-in-out overflow-hidden inline-block` +
                (collapsed ? ' max-w-0 opacity-0 pointer-events-none' : ' max-w-[200px] opacity-100')
              }
            >
              {websiteConfig?.siteName}
            </span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto h-[calc(100vh-60px)] pb-4 bg-white dark:bg-gray-800">
        <Menu
          onClick={({ key }) => navigate(`/admin/${key}`)}
          mode="inline"
          selectedKeys={[getSelectedKey(location.pathname)]}
          items={menuItems}
          onOpenChange={onOpenChange}
          openKeys={stateOpenKeys}
          className="border-0 bg-transparent [&_.ant-menu-item]:text-gray-700 [&_.ant-menu-item]:dark:text-gray-300 [&_.ant-menu-submenu-title]:text-gray-700 [&_.ant-menu-submenu-title]:dark:text-gray-300 [&_.ant-menu-item-selected]:bg-blue-50 [&_.ant-menu-item-selected]:dark:bg-blue-900 [&_.ant-menu-item-selected]:text-blue-600 [&_.ant-menu-item-selected]:dark:text-blue-300 [&_.ant-menu-item:hover]:bg-gray-100 [&_.ant-menu-item:hover]:dark:bg-gray-700 [&_.ant-menu-submenu-title:hover]:bg-gray-100 [&_.ant-menu-submenu-title:hover]:dark:bg-gray-700 [&_.ant-menu-sub_.ant-menu-item:hover]:dark:text-gray-300 [&_.ant-menu-sub_.ant-menu-item:hover]:dark:bg-gray-700"
        />
      </div>
    </Sider>
  )
}

export default SiderLayout
