import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import FaviconUpdater from '@/components/FaviconUpdater'
import { useClientBootstrap } from '@/hooks/useClientBootstrap'
import LayoutDefault from './Layout/LayoutDefault'
import AllRoute from './components/AllRoute'
import ScrollToTop from './components/ScrollToTop'
import { authAdminRefresh } from './services/adminAuth.service'
import { getAdminMe } from './services/adminMeService'
import { logout, setUser } from './stores/adminUser'
import { applyDocumentTheme } from './utils/themeMode'
import { clearTokens, getAccessToken, setAccessToken } from './utils/auth'
import { applyDocumentLanguage } from './utils/languageMode'

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  useClientBootstrap()

  const isDark = useSelector(state => !!state.darkMode?.value)
  const language = useSelector(state => state.language?.value || 'vi')

  useEffect(() => {
    applyDocumentTheme(isDark)
  }, [isDark])

  useEffect(() => {
    applyDocumentLanguage(language)
  }, [language])

  useEffect(() => {
    let isMounted = true

    const initAdminUser = async () => {
      const token = getAccessToken()

      if (!token || !location.pathname.startsWith('/admin')) {
        return
      }

      try {
        const user = await getAdminMe()
        if (user && isMounted) {
          dispatch(setUser({ user, token }))
        }
      } catch {
        try {
          const refreshResult = await authAdminRefresh()

          if (!refreshResult.accessToken) {
            throw new Error('No new token')
          }

          setAccessToken(refreshResult.accessToken)

          const user = await getAdminMe()
          if (user && isMounted) {
            dispatch(
              setUser({
                user,
                token: refreshResult.accessToken
              })
            )
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

    initAdminUser()

    return () => {
      isMounted = false
    }
  }, [dispatch, location.pathname, navigate])

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
