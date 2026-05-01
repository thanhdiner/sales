import './index.scss'
import { Breadcrumb, Layout } from 'antd'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Header from './Header'
import SiderLayout from './Sider'
import { connectSocket, getSocket } from '@/services/realtime/socket'
import { adminRouteLabelKeys } from './Sider/adminMenuUtils'

const { Content } = Layout
const ADMIN_MOBILE_SIDEBAR_QUERY = '(max-width: 767.98px)'
const CHAT_DESKTOP_SIDEBAR_LOCK_QUERY = '(min-width: 1280px)'
const ADMIN_SIDEBAR_COLLAPSED_STORAGE_KEY = 'adminSidebarCollapsed'

const getStoredAdminSidebarCollapsed = () => {
  if (typeof window === 'undefined') return false
  if (window.matchMedia(ADMIN_MOBILE_SIDEBAR_QUERY).matches) return true

  return window.localStorage.getItem(ADMIN_SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true'
}

function AdminLayout() {
  const { t } = useTranslation('adminLayout')
  const [collapsed, setCollapsed] = useState(getStoredAdminSidebarCollapsed)
  const [isChatDesktopViewport, setIsChatDesktopViewport] = useState(() => (
    typeof window === 'undefined' ? false : window.matchMedia(CHAT_DESKTOP_SIDEBAR_LOCK_QUERY).matches
  ))
  const location = useLocation()
  const user = useSelector(state => state.adminUser.user)
  const newOrderHandlerRef = useRef(null)
  const isAdminChatPage = location.pathname === '/admin/chat'
  const isAdminDashboardPage = location.pathname === '/admin/dashboard' || location.pathname === '/admin'
  const shouldLockChatSidebar = isAdminChatPage && isChatDesktopViewport
  const effectiveCollapsed = shouldLockChatSidebar ? true : collapsed
  const updateCollapsed = useCallback(value => {
    setCollapsed(value)
    window.localStorage.setItem(ADMIN_SIDEBAR_COLLAPSED_STORAGE_KEY, String(value))
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia(CHAT_DESKTOP_SIDEBAR_LOCK_QUERY)
    const handleChange = event => setIsChatDesktopViewport(event.matches)

    setIsChatDesktopViewport(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (shouldLockChatSidebar) {
      setCollapsed(true)
    }
  }, [shouldLockChatSidebar])

  // Khởi động socket khi admin vào layout — KHÔNG disconnect khi unmount vì socket phải persistent
  useEffect(() => {
    connectSocket({ role: 'admin', userId: user?._id })
  }, [user?._id])

  useEffect(() => {
    document.body.classList.add('admin-layout-active')
    return () => {
      document.body.classList.remove('admin-layout-active')
    }
  }, [])

  // Hàm để Header có thể đăng ký lắng nghe new_order
  const onNewOrder = useCallback(handler => {
    newOrderHandlerRef.current = handler
    const socket = getSocket()
    socket.off('new_order')
    socket.on('new_order', handler)

    return () => {
      if (newOrderHandlerRef.current === handler) {
        socket.off('new_order', handler)
        newOrderHandlerRef.current = null
      }
    }
  }, [])

  const pathSnippets = location.pathname.split('/').filter(i => i)
  const breadcrumbItems = pathSnippets.map((segment, i) => {
    const url = `/${pathSnippets.slice(0, i + 1).join('/')}`
    const isLast = i === pathSnippets.length - 1
    const labelKey = adminRouteLabelKeys[segment]
    const label = labelKey ? t(labelKey) : segment

    return {
      title: isLast ? (
        <span className="admin-breadcrumb-current capitalize">{label}</span>
      ) : (
        <Link to={url} className="admin-breadcrumb-link capitalize">
          {label}
        </Link>
      )
    }
  })

  return (
    <>
      <Layout className="admin-layout-root overflow-hidden">
        {!effectiveCollapsed && (
          <div onClick={() => setCollapsed(true)} className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-20 md:hidden animate-fadeIn" />
        )}
        <SiderLayout
          collapsed={effectiveCollapsed}
          setCollapsed={setCollapsed}
          location={location}
          compactChatMenu={shouldLockChatSidebar}
        />
        <Layout className="admin-layout-shell flex flex-col overflow-hidden transition-colors">
          <Header
            collapsed={effectiveCollapsed}
            setCollapsed={updateCollapsed}
            onNewOrder={onNewOrder}
            canToggleSider={!shouldLockChatSidebar}
          />
          {!isAdminChatPage && !isAdminDashboardPage && (
            <Breadcrumb className="admin-layout-breadcrumb mt-2.5 mx-2 md:mx-4 mb-0 flex-shrink-0" items={breadcrumbItems} />
          )}
          <Content
            className={
              isAdminChatPage
                ? 'flex-1 min-h-0 overflow-hidden p-2 md:p-3 transition-all'
                : `admin-layout-content ${isAdminDashboardPage ? 'admin-layout-content--dashboard' : ''} flex-1 min-h-0 overflow-y-auto mt-3 mx-2 md:mx-4 mb-4 p-3 sm:p-4 md:p-6 transition-all`
            }
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default AdminLayout
