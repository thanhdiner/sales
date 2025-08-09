import AllRoute from './components/AllRoute'
import LayoutDefault from './Layout/LayoutDefault'
import ScrollToTop from './components/ScrollToTop'
import { useEffect } from 'react'
import { getAdminMe } from './services/adminMeService'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { setUser, logout } from './stores/adminUser'
import { clearTokens, getAccessToken, getClientAccessToken, getClientAccessTokenSession, setAccessToken } from './utils/auth'
import { authAdminRefresh } from './services/adminAuth.service'
import { fetchWebsiteConfig } from './stores/websiteConfigSlice'
import FaviconUpdater from '@/components/FaviconUpdater'
import { setUser as setClientUser } from './stores/user'
import { getClientMe } from './services/userService'

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // Client theme (Redux) — GIỮ như bạn đang có
  const clientDarkMode = useSelector(state => state.darkMode?.value)

  // ✅ Chỉ App áp dụng html.dark dựa vào route
  const isAdmin = location.pathname.startsWith('/admin')

  // Admin: đọc từ localStorage('darkMode') vì bạn không lưu redux cho admin
  const adminDarkMode = (() => {
    try {
      return localStorage.getItem('darkMode') === 'true'
    } catch {
      return false
    }
  })()

  const isDark = isAdmin ? adminDarkMode : !!clientDarkMode

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', isDark)
    root.style.colorScheme = isDark ? 'dark' : 'light'
  }, [isDark])

  useEffect(() => {
    dispatch(fetchWebsiteConfig())
  }, [dispatch])

  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      const fetchUser = async () => {
        const token = getClientAccessToken() || getClientAccessTokenSession()
        if (token) {
          try {
            const user = await getClientMe()
            if (user) {
              dispatch(setClientUser({ user: user, token }))
              if (getClientAccessToken() === token) {
                localStorage.setItem('user', JSON.stringify(user))
              }
              if (getClientAccessTokenSession() === token) {
                sessionStorage.setItem('user', JSON.stringify(user))
              }
            } else {
              dispatch(setClientUser({ user: null, token: null }))
              localStorage.removeItem('user')
              sessionStorage.removeItem('user')
            }
          } catch (err) {
            dispatch(setClientUser({ user: null, token: null }))
            localStorage.removeItem('user')
            sessionStorage.removeItem('user')
          }
        } else {
          dispatch(setClientUser({ user: null, token: null }))
          localStorage.removeItem('user')
          sessionStorage.removeItem('user')
        }
      }
      fetchUser()
    }
  }, [dispatch, location])

  useEffect(() => {
    let isMounted = true
    const initUser = async () => {
      const token = getAccessToken()
      if (token && location.pathname.startsWith('/admin')) {
        try {
          const user = await getAdminMe()
          if (user && isMounted) dispatch(setUser({ user, token }))
        } catch {
          try {
            const refreshRes = await authAdminRefresh()
            if (refreshRes.accessToken) {
              setAccessToken(refreshRes.accessToken)
              const user = await getAdminMe()
              if (user && isMounted) dispatch(setUser({ user, token: refreshRes.accessToken }))
            } else {
              throw new Error('No new token')
            }
          } catch {
            if (isMounted) {
              dispatch(logout())
              clearTokens()
              navigate('/admin/login', { replace: true })
            }
          }
        }
      }
    }
    initUser()
    return () => {
      isMounted = false
    }
  }, [dispatch, navigate, location])

  return (
    <>
      <FaviconUpdater />
      <ScrollToTop />
      <AllRoute>
        <LayoutDefault />
      </AllRoute>
    </>
  )
}

export default App
