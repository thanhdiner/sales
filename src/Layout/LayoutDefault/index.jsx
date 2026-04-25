import React, { useState } from 'react'
import { Drawer, Grid, Layout } from 'antd'
import { useSelector } from 'react-redux'
import LiveChat from '@/components/LiveChat'
import CompareBar from '@/components/CompareBar'
import MenuSider from './components/MenuSider'
import Footer from './Footer'
import Header from './Header'
import useClientNotifications from './hooks/useClientNotifications'
import './LayoutDefault.scss'
import { Outlet } from 'react-router-dom'

const { Content, Sider } = Layout
const { useBreakpoint } = Grid

function LayoutDefault() {
  const screens = useBreakpoint()
  const isDesktop = screens.lg
  const [drawerOpen, setDrawerOpen] = useState(false)
  const user = useSelector(state => state.clientUser.user)
  const { notifications, setNotifications, notifContextHolder } = useClientNotifications(user)

  return (
    <Layout className="layout-default">
      {notifContextHolder}
      <Header onOpenMenu={() => setDrawerOpen(true)} notifications={notifications} setNotifications={setNotifications} />

      <Layout className="layout-default__body">
        {isDesktop && (
          <Sider width={250} className="layout-default__sider">
            <MenuSider className="layout-default__menu__sider" />
          </Sider>
        )}

        <Layout className="layout-default__body--sub">
          <Content className="layout-default__content">
            <Outlet />
          </Content>
          <Footer />
        </Layout>
      </Layout>
      {!isDesktop && (
        <Drawer
          title={<span className="dark:text-white">Danh muc san pham</span>}
          placement="left"
          width={250}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          className="layout-default__drawer"
          bodyStyle={{ padding: 0 }}
        >
          <div className="layout-default__drawer__inner">
            <MenuSider />
          </div>
        </Drawer>
      )}

      <LiveChat />
      <CompareBar />
    </Layout>
  )
}

export default LayoutDefault
