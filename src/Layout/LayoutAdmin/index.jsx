import './LayoutAdmin.scss'
import { Breadcrumb, Layout } from 'antd'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from './Header'
import SiderLayout from './SiderLayout'
import { connectSocket, getSocket } from '@/services/socketService'

const { Content } = Layout

function LayoutAdmin() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const user = useSelector(state => state.adminUser.user)
  const newOrderHandlerRef = useRef(null)

  // Khởi động socket khi admin vào layout — KHÔNG disconnect khi unmount vì socket phải persistent
  useEffect(() => {
    connectSocket({ role: 'admin', userId: user?._id })
  }, [user?._id])

  // Hàm để Header có thể đăng ký lắng nghe new_order
  const onNewOrder = useCallback(handler => {
    newOrderHandlerRef.current = handler
    const socket = getSocket()
    socket.off('new_order') // tránh duplicate listeners
    socket.on('new_order', handler)
  }, [])

  const pathSnippets = location.pathname.split('/').filter(i => i)
  const breadcrumbItems = pathSnippets.map((segment, i) => {
    const url = `/${pathSnippets.slice(0, i + 1).join('/')}`
    const isLast = i === pathSnippets.length - 1
    return {
      title: isLast ? (
        <span className="font-semibold text-[#1677ff] capitalize">{segment}</span>
      ) : (
        <Link to={url} className="capitalize dark:text-gray-300">
          {segment}
        </Link>
      )
    }
  })

  return (
    <>
      <Layout className="h-screen overflow-hidden">
        {!collapsed && (
          <div onClick={() => setCollapsed(true)} className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-20 md:hidden animate-fadeIn" />
        )}
        <SiderLayout {...{ collapsed, setCollapsed, location }} />
        <Layout className="admin-layout-shell flex flex-col overflow-hidden transition-colors">
          <Header {...{ collapsed, setCollapsed, onNewOrder }} />
          <Breadcrumb className="admin-layout-breadcrumb mt-2.5 mx-2 md:mx-4 mb-0 flex-shrink-0" items={breadcrumbItems} />
          <Content className="admin-layout-content flex-1 min-h-0 overflow-y-auto mt-3 mx-2 md:mx-4 mb-4 p-3 sm:p-4 md:p-6 transition-all">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default LayoutAdmin
