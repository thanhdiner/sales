import React, { useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Layout, Drawer, Grid, notification } from 'antd'
import MenuSider from '../../components/MenuSider'
import { Outlet } from 'react-router-dom'
import './LayoutDefault.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setCart } from '@/stores/cart'
import { getCart } from '@/services/cartsService'
import { getClientAccessToken, getClientAccessTokenSession } from '@/utils/auth'
import FloatingButtons from '@/components/FloatingButtons'
import { connectSocket, disconnectSocket, getSocket } from '@/services/socketService'
import { Package } from 'lucide-react'

const { Content } = Layout

const { Sider } = Layout

const { useBreakpoint } = Grid

function LayoutDefault() {
  const dispatch = useDispatch()
  const screens = useBreakpoint()
  const isDesktop = screens.lg
  const [drawerOpen, setDrawerOpen] = useState(false)
  const user = useSelector(state => state.user.user)
  const [notifApi, notifContextHolder] = notification.useNotification()

  // ─── Load cart ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCart = async () => {
      const token = getClientAccessToken() || getClientAccessTokenSession()
      if (token) {
        try {
          const cart = await getCart()
          dispatch(setCart(cart.items))
        } catch {
          dispatch(setCart([]))
        }
      } else {
        dispatch(setCart([]))
      }
    }
    fetchCart()
    // eslint-disable-next-line
  }, [dispatch])

  // ─── Socket: kết nối khi đăng nhập, lắng nghe cập nhật đơn hàng ───────────────────
  useEffect(() => {
    const token = getClientAccessToken() || getClientAccessTokenSession()
    if (!token || !user?._id) return

    connectSocket({ role: 'user', userId: user._id })
    const socket = getSocket()

    const handleStatusUpdate = ({ _id, status }) => {
      const statusMap = {
        confirmed: 'Đã xác nhận',
        shipping: 'Đang giao hàng',
        completed: 'Đã hoàn thành',
        cancelled: 'Đã hủy'
      }
      const label = statusMap[status] || status
      notifApi.open({
        message: 'Cập nhật đơn hàng 📦',
        description: `Đơn hàng #${String(_id).slice(-6).toUpperCase()} → ${label}`,
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
  }, [user?._id, notifApi])

  return (
    <Layout className="layout-default">
      {notifContextHolder}
      <Header onOpenMenu={() => setDrawerOpen(true)} />
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

      <FloatingButtons />

      {/* Mobile / Tablet Drawer */}
      {!isDesktop && (
        <Drawer
          title={<span className="dark:text-white">Danh mục sản phẩm</span>}
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
    </Layout>
  )
}

export default LayoutDefault
