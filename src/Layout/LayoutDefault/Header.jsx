import { Badge, Col, Dropdown, Row, message } from 'antd'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCartOutlined, UserOutlined, SettingOutlined, LogoutOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { userLogout } from '@/services/userService'
import { logout } from '@/stores/user'
import { clearClientTokens, clearClientTokensSession } from '@/utils/auth'

import SearchSuggest from '@/components/SearchSuggest'
import HeaderSkeleton from '@/components/HeaderSkeleton'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const cartItems = useSelector(state => state.cart.items) || []

  const user = useSelector(state => state.clientUser.user)
  const isLoggedIn = !!user

  const guestMenuItems = [
    {
      key: 'signin',
      label: 'Sign In',
      icon: <LoginOutlined />
    },
    {
      key: 'signup',
      label: 'Sign Up',
      icon: <UserAddOutlined />
    }
  ]

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />
    },
    {
      key: 'orders',
      label: 'My Orders',
      icon: <ShoppingCartOutlined />
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: 'Sign Out',
      icon: <LogoutOutlined />,
      danger: true
    }
  ]

  const handleMenuClick = async ({ key }) => {
    if (!isLoggedIn) {
      if (key === 'signin') navigate('/user/login')
      if (key === 'signup') navigate('/user/register')
    } else {
      if (key === 'profile') navigate('/user/profile')
      if (key === 'settings') navigate('/user/settings')
      if (key === 'orders') navigate('/orders')
      if (key === 'logout') {
        try {
          await userLogout()
          message.success('Đăng xuất thành công!')
        } catch (err) {
          message.warning('Có lỗi khi đăng xuất. Vẫn sẽ đăng xuất tài khoản!')
        }
        clearClientTokens()
        clearClientTokensSession()
        localStorage.removeItem('user')
        sessionStorage.removeItem('user')
        dispatch(logout())
        navigate('/')
      }
    }
  }

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Flash Sale', path: '/flash-sale' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
    // { label: 'Blog', path: '/blog' }
  ]

  if (!websiteConfig || !websiteConfig.logoUrl) {
    return <HeaderSkeleton />
  }

  return (
    <header className="header">
      <Row style={{ width: '100%' }}>
        <Col span={6}>
          <Link className="header__logo--wrap" to="/">
            <img
              src={websiteConfig?.logoUrl}
              alt={websiteConfig?.siteName || 'Logo'}
              className="w-12 h-12 bg-white rounded-sm shadow-sm object-contain ml-8"
            />
            <span className="l-2 text-2xl font-semibold text-black dark:text-white whitespace-nowrap transition-all duration-500 ease-in-out overflow-hidden inline-block">
              {websiteConfig?.siteName}
            </span>
          </Link>
        </Col>

        <Col className="flex items-center justify-center" span={12}>
          <nav className="header__nav">
            <ul className="header__nav__list">
              {navItems.map(item => (
                <li key={item.path} className="header__nav__item">
                  <NavLink to={item.path}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </Col>

        <Col span={6}>
          <div className="header__action">
            {/* SEARCH HEADER */}
            <div className="header__action__search">
              {/* <form
                className="header__action__search--wrap"
                onSubmit={handleHeaderSearch}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Input
                  placeholder="Search Product..."
                  className="header__action__search--input"
                  value={headerSearch}
                  onChange={e => setHeaderSearch(e.target.value)}
                  onPressEnter={handleHeaderSearch}
                />
                <button
                  type="submit"
                  className="header__action__search--btn"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  tabIndex={-1}
                >
                  <SearchOutlined style={{ fontSize: '22px' }} />
                </button>
              </form> */}
              <SearchSuggest />
            </div>

            {isLoggedIn && (
              <div className="header__action__cart">
                <Link to="/cart">
                  <button className="header__action__cart--btn">
                    <Badge style={{ transition: 'all 0.1s' }} offset={[5, -5]} size="small" count={cartItems.length} overflowCount={999}>
                      <ShoppingCartOutlined className="header__action__cart--icon" style={{ fontSize: '22px' }} />
                    </Badge>
                  </button>
                </Link>
              </div>
            )}

            <div className="header__action__account">
              <Dropdown
                menu={{
                  items: isLoggedIn ? userMenuItems : guestMenuItems,
                  onClick: handleMenuClick
                }}
                placement="bottomRight"
                arrow
                trigger={['click']}
              >
                <button className="header__action__account--btn">
                  {isLoggedIn && user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full object-cover border border-solid border-gray-200"
                    />
                  ) : isLoggedIn && user?.fullName ? (
                    <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 font-bold text-[18px] flex items-center justify-center">
                      {user.fullName?.trim()?.split(' ').pop()?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  ) : (
                    <UserOutlined style={{ fontSize: '22px' }} />
                  )}
                </button>
              </Dropdown>
            </div>
          </div>
        </Col>
      </Row>
    </header>
  )
}

export default Header
