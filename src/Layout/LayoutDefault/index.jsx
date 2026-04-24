import React, { useEffect, useState } from 'react'
import { Drawer, Grid, Layout, notification } from 'antd'
import { Package } from 'lucide-react'
import { useSelector } from 'react-redux'
import LiveChat from '@/components/LiveChat'
import CompareBar from '@/components/CompareBar'
import { connectSocket, disconnectSocket, getSocket } from '@/services/socketService'
import { getClientAccessToken, getClientAccessTokenSession } from '@/utils/auth'
import MenuSider from './components/MenuSider'
import {
  clearStoredNotifications,
  createOrderStatusNotification,
  getDesktopNotificationBody,
  loadStoredNotifications,
  prependNotification,
  saveStoredNotifications
} from './components/NotificationBell/notificationUtils'
import Footer from './Footer'
import Header from './Header'
import './LayoutDefault.scss'
import { Outlet } from 'react-router-dom'

const { Content, Sider } = Layout
const { useBreakpoint } = Grid

function LayoutDefault() {
  const screens = useBreakpoint()
  const isDesktop = screens.lg
  const [drawerOpen, setDrawerOpen] = useState(false)
  const user = useSelector(state => state.clientUser.user)
  const [notifications, setNotifications] = useState(() => loadStoredNotifications())
  const [notifApi, notifContextHolder] = notification.useNotification()

  useEffect(() => {
    if (user?._id) {
      saveStoredNotifications(notifications)
    } else {
      clearStoredNotifications()
    }
  }, [notifications, user?._id])

  useEffect(() => {
    const token = getClientAccessToken() || getClientAccessTokenSession()

    if (!token || !user?._id) {
      setNotifications([])
      return
    }

    connectSocket({ role: 'user', userId: user._id })
    const socket = getSocket()

    const handleStatusUpdate = ({ _id, status }) => {
      const orderUpdate = { _id, status }
      const notificationItem = createOrderStatusNotification(orderUpdate)

      setNotifications(prev => prependNotification(prev, notificationItem))

      notifApi.open({
        message: 'Cập nhật đơn hàng',
        description: getDesktopNotificationBody(orderUpdate),
        icon: <Package className="text-blue-500" />,
        placement: 'topRight',
        duration: 6
      })
    }

    socket.on('order_status_updated', handleStatusUpdate)

    return () => {
      socket.off('order_status_updated', handleStatusUpdate)
      disconnectSocket()
    }
  }, [notifApi, user?._id])

  return (
    <Layout className="layout-default">
      {notifContextHolder}
      <Header onOpenMenu={() => setDrawerOpen(true)} notifications={notifications} setNotifications={setNotifications} />

      <Layout className="layout-default__body dark:bg-gray-700">
        {isDesktop && (
          <Sider width={250} className="layout-default__sider">
            <MenuSider className="layout-default__menu__sider" />
          </Sider>
        )}

        <Layout className="layout-default__body--sub dark:bg-gray-700">
          <Content className="layout-default__content dark:bg-gray-700">
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
          className="layout-default__drawer dark:bg-gray-800"
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
