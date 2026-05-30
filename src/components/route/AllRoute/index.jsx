import { useEffect } from 'react'
import { useLocation, useRoutes } from 'react-router-dom'
import { routes } from '@/routes'

function AllRoute() {
  const location = useLocation()
  const element = useRoutes(routes)
  const isAuthRoute = /^\/user\/(login|register|forgot-password|oauth-callback)/.test(location.pathname)

  useEffect(() => {
    document.body.classList.toggle('auth-route-boot', isAuthRoute)
  }, [isAuthRoute])

  if (!isAuthRoute) return <>{element}</>

  return (
    <div className="auth-route-transition-shell">
      <div className="auth-route-transition-page">
        {element}
      </div>
    </div>
  )
}

export default AllRoute
