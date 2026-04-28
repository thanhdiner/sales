import { Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import { useSelector } from 'react-redux'
import { buildAdminMenuItems, getSelectedAdminMenuKey } from './adminMenuUtils'

const normalizeText = value => String(value || '').trim().toLowerCase()

const isSuperAdmin = user => {
  const roleLabel = normalizeText(user?.role_id?.label || user?.role?.label || user?.role_id || user?.role)
  const username = normalizeText(user?.username)

  return username === 'superadmin' || roleLabel === 'superadmin' || roleLabel === 'super admin'
}

function SiderLayout({ collapsed, setCollapsed, location, compactChatMenu = false }) {
  const navigate = useNavigate()
  const { t } = useTranslation('adminLayout')
  const [stateOpenKeys, setStateOpenKeys] = useState([])
  const permissions = useAdminPermissions()

  const adminUser = useSelector(state => state.adminUser.user)
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const shouldPreservePermissionItems = !Array.isArray(adminUser?.role_id?.permissions)
  const shouldShowAllPermissionItems = isSuperAdmin(adminUser)

  const menuItems = useMemo(
    () => buildAdminMenuItems(permissions, t, {
      preservePermissionItems: shouldPreservePermissionItems,
      isSuperAdmin: shouldShowAllPermissionItems,
      compactGroups: compactChatMenu
        ? {
            'live-chat': {
              key: 'chat',
              labelKey: 'routes.live-chat'
            }
          }
        : undefined
    }),
    [compactChatMenu, permissions, shouldPreservePermissionItems, shouldShowAllPermissionItems, t]
  )

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
    if (compactChatMenu) {
      setStateOpenKeys([])
      return
    }

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
  }, [compactChatMenu, location.pathname])

  const onOpenChange = openKeys => {
    const currentOpenKey = openKeys.find(key => stateOpenKeys.indexOf(key) === -1)
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys.filter(key => key !== currentOpenKey).findIndex(key => levelKeys[key] === levelKeys[currentOpenKey])
      setStateOpenKeys(openKeys.filter((_, index) => index !== repeatIndex).filter(key => levelKeys[key] <= levelKeys[currentOpenKey]))
    } else setStateOpenKeys(openKeys)
  }

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
      className={`admin-sider h-screen flex flex-col z-30 transition-all ease-in-out duration-300
      md:sticky md:top-0 md:left-0
      fixed top-0 left-0 ${collapsed ? '-translate-x-full' : 'translate-x-0'} md:translate-x-0 shadow-lg md:shadow-none`}
    >
      <div className="admin-sider-top sticky top-0 z-10 px-3">
        <Link to={'/admin/dashboard'}>
          <div className={`flex items-center h-16 overflow-hidden transition-all duration-700 ease-in-out`}>
            <div className={`flex-shrink-0 transition-all duration-700 ${collapsed ? 'pl-2' : 'pl-4'}`}>
              <img
                src={websiteConfig?.logoUrl}
                alt={websiteConfig?.siteName || 'Logo'}
                className="admin-sider-logo-image w-10 h-10 rounded-sm object-contain"
              />
            </div>
            <span
              className={
                `admin-sider-site-name ml-2 text-2xl font-semibold whitespace-nowrap
     transition-all duration-500 ease-in-out overflow-hidden inline-block` +
                (collapsed ? ' max-w-0 opacity-0 pointer-events-none' : ' max-w-[200px] opacity-100')
              }
            >
              {websiteConfig?.siteName}
            </span>
          </div>
        </Link>
      </div>

      <div className="admin-sider-scroll flex-1 overflow-y-auto h-[calc(100vh-60px)] pb-4">
        <Menu
          onClick={({ key }) => navigate(`/admin/${key}`)}
          mode="inline"
          selectedKeys={[getSelectedAdminMenuKey(location.pathname)]}
          items={menuItems}
          onOpenChange={onOpenChange}
          openKeys={stateOpenKeys}
          className="admin-sider-menu border-0 bg-transparent"
        />
      </div>
    </Sider>
  )
}

export default SiderLayout
