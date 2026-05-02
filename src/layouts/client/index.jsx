import React, { useEffect, useState } from 'react'
import { Button, Drawer, Grid, Layout } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { useLocation, Outlet } from 'react-router-dom'
import LiveChat from '@/components/client/LiveChat'
import CompareBar from '@/components/client/CompareBar'
import { PageContextProvider } from '@/features/chat/pageContext/PageContextProvider'
import { useClientBootstrap } from '@/hooks/bootstrap/useClientBootstrap'
import MenuSider from './components/MenuSider'
import MobileBottomNav from './components/MobileBottomNav'
import Footer from './components/Footer'
import Header from './components/Header'
import useClientNotifications from './hooks/useClientNotifications'
import './index.scss'

const { Content, Sider } = Layout
const { useBreakpoint } = Grid
const SIDEBAR_COLLAPSED_STORAGE_KEY = 'clientSidebarCollapsed'

function ClientLayout() {
  useClientBootstrap()

  const screens = useBreakpoint()
  const isDesktop = screens.lg
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true')
  const user = useSelector(state => state.clientUser.user)
  const { notifications, setNotifications, notifContextHolder } = useClientNotifications(user)
  const isHomePage = location.pathname === '/'
  const layoutClassName = `layout-default layout-default--client-mobile${isHomePage ? ' layout-default--home' : ''}${sidebarCollapsed ? ' layout-default--sidebar-collapsed' : ''}`

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(sidebarCollapsed))
  }, [sidebarCollapsed])

  return (
    <Layout className={layoutClassName}>
      {notifContextHolder}
      <Header onOpenMenu={() => setDrawerOpen(true)} notifications={notifications} setNotifications={setNotifications} />

      <PageContextProvider>
        <Layout className="layout-default__body">
          {isDesktop && (
            <Sider
              width={250}
              collapsedWidth={48}
              trigger={null}
              collapsible
              collapsed={sidebarCollapsed}
              className="layout-default__sider"
            >
              <Button
                type="text"
                size="small"
                icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                aria-label={sidebarCollapsed ? 'Mở danh mục sản phẩm' : 'Thu gọn danh mục sản phẩm'}
                className="layout-default__sider-toggle"
                onClick={() => setSidebarCollapsed(value => !value)}
              />
              <div className="layout-default__sider-menu-wrap">
                <MenuSider className="layout-default__menu__sider" />
              </div>
            </Sider>
          )}

          <Layout className="layout-default__body--sub">
            <Content className="layout-default__content">
              <Outlet />
            </Content>
            <Footer />
          </Layout>
        </Layout>
        <LiveChat />
      </PageContextProvider>
      {!isDesktop && (
        <Drawer
          title={<span className="dark:text-white">Danh mục sản phẩm</span>}
          placement="left"
          width={250}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          className="layout-default__drawer"
          styles={{ body: { padding: 0 } }}
        >
          <div className="layout-default__drawer__inner">
            <MenuSider showGroupTitle={false} />
          </div>
        </Drawer>
      )}

      {!isDesktop && <MobileBottomNav />}
      <CompareBar />
    </Layout>
  )
}

export default ClientLayout
