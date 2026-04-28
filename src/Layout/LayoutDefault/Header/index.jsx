import { Col, Grid, Row } from 'antd'
import { useSelector } from 'react-redux'
import HeaderSkeleton from '@/components/HeaderSkeleton'
import HeaderActions from './HeaderActions'
import HeaderLogo from './HeaderLogo'
import HeaderNav from './HeaderNav'
import useAutoHideHeader from './useAutoHideHeader'

function Header({ onOpenMenu, notifications, setNotifications }) {
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const user = useSelector(state => state.clientUser.user)
  const { useBreakpoint } = Grid
  const screens = useBreakpoint()
  const isDesktop = screens.lg
  const headerHidden = useAutoHideHeader()

  if (!websiteConfig || !websiteConfig.logoUrl) {
    return <HeaderSkeleton />
  }

  return (
    <header className={`header dark:text-white${headerHidden ? ' header--hidden' : ''}`}>
      <Row style={{ width: '100%' }} align="middle" gutter={12}>
        <HeaderLogo websiteConfig={websiteConfig} isDesktop={isDesktop} onOpenMenu={onOpenMenu} />

        {isDesktop && (
          <Col lg={9} xl={9} className="flex items-center justify-center">
            <HeaderNav />
          </Col>
        )}

        <HeaderActions
          isDesktop={isDesktop}
          user={user}
          notifications={notifications}
          setNotifications={setNotifications}
        />
      </Row>
    </header>
  )
}

export default Header
