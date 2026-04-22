import React, { useState, useEffect, useRef } from 'react'
import { Badge, Col, Dropdown, Row, message, Grid, Button } from 'antd'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ShoppingCartOutlined,
  HeartOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  MoonOutlined,
  SunOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { clearClientSessionState } from '@/lib/clientCache'
import { normalizeWishlistItems } from '@/lib/normalizeWishlistItems'
import { userLogout } from '@/services/userService'
import { setDarkMode } from '@/stores/darkModeSlice'
import { clearClientTokens, clearClientTokensSession } from '@/utils/auth'

import SearchSuggest from '@/components/SearchSuggest'
import HeaderSkeleton from '@/components/HeaderSkeleton'

function Header({ onOpenMenu }) {
  // ─── Smart auto-hide header ─────────────────────────────────────
  const [headerHidden, setHeaderHidden] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const THRESHOLD = 10

    const handleScroll = () => {
      const currentY = window.scrollY

      if (currentY < 80) {
        setHeaderHidden(false)
      } else if (currentY - lastScrollY.current > THRESHOLD) {
        setHeaderHidden(true)
      } else if (lastScrollY.current - currentY > THRESHOLD) {
        setHeaderHidden(false)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const cartItems = useSelector(state => state.cart.items) || []
  const user = useSelector(state => state.clientUser.user)
  const wishlistItems = useSelector(state => normalizeWishlistItems(state.wishlist.items))
  const darkMode = useSelector(state => !!state.darkMode?.value)
  const isLoggedIn = !!user

  const wishlistActiveColor = '#ff424e'

  const themeMenuItem = {
    key: 'theme',
    icon: darkMode ? <MoonOutlined /> : <SunOutlined />,
    label: (
      <div className="flex min-w-[170px] items-center justify-between gap-3">
        <span>Dark Mode</span>
        <span
          aria-hidden="true"
          className={`relative h-5 w-9 rounded-full transition-colors ${
            darkMode ? 'bg-gray-900 dark:bg-gray-100' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform dark:bg-gray-900 ${
              darkMode ? 'translate-x-4' : ''
            }`}
          />
        </span>
      </div>
    )
  }

  const guestMenuItems = [
    { key: 'signin', label: 'Sign In', icon: <LoginOutlined /> },
    { key: 'signup', label: 'Sign Up', icon: <UserAddOutlined /> },
    { type: 'divider' },
    themeMenuItem
  ]

  const userMenuItems = [
    { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
    { key: 'orders', label: 'My Orders', icon: <ShoppingCartOutlined /> },
    {
      key: 'wishlist',
      label: 'Wishlist',
      icon: <HeartOutlined />
    },
    { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
    themeMenuItem,
    { type: 'divider' },
    {
      key: 'logout',
      label: <span className="text-red-500">Logout</span>,
      icon: <LogoutOutlined className="text-red-500" />,
      danger: true
    }
  ]

  const handleMenuClick = async ({ key }) => {
    if (key === 'theme') {
      dispatch(setDarkMode(!darkMode))
      setAccountMenuOpen(true)
      return
    }

    setAccountMenuOpen(false)

    if (!isLoggedIn) {
      if (key === 'signin') navigate('/user/login')
      if (key === 'signup') navigate('/user/register')
    } else {
      if (key === 'profile') navigate('/user/profile')
      if (key === 'settings') navigate('/settings')
      if (key === 'orders') navigate('/orders')
      if (key === 'wishlist') navigate('/wishlist')

      if (key === 'logout') {
        try {
          await userLogout()
          message.success('Đăng xuất thành công!')
        } catch {
          message.warning('Có lỗi khi đăng xuất. Vẫn sẽ đăng xuất tài khoản!')
        }

        clearClientTokens()
        clearClientTokensSession()
        localStorage.removeItem('user')
        sessionStorage.removeItem('user')
        clearClientSessionState(dispatch)
        navigate('/')
      }
    }
  }

  const handleAccountMenuOpenChange = (nextOpen, info) => {
    if (!nextOpen && info?.source === 'menu') {
      return
    }

    setAccountMenuOpen(nextOpen)
  }

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Flash Sale', path: '/flash-sale' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ]

  const { useBreakpoint } = Grid
  const screens = useBreakpoint()
  const isDesktop = screens.lg

  if (!websiteConfig || !websiteConfig.logoUrl) {
    return <HeaderSkeleton />
  }

  return (
    <header className={`header dark:bg-gray-800 dark:text-white${headerHidden ? ' header--hidden' : ''}`}>
      {/* Hàng trên: Logo + search/cart/account */}
      <Row style={{ width: '100%' }} align="middle" gutter={12}>
        <Col xs={12} sm={8} md={6} lg={6} className="flex items-center gap-2">
          {!isDesktop && (
            <Button
              aria-label="Mở menu danh mục"
              className="header__hamburger dark:text-white"
              type="text"
              onClick={onOpenMenu}
              icon={
                <span className="flex flex-col gap-[4px]">
                  <span className="block w-5 h-[2px] bg-current" />
                  <span className="block w-5 h-[2px] bg-current" />
                  <span className="block w-5 h-[2px] bg-current" />
                </span>
              }
            />
          )}

          <Link className="header__logo--wrap" to="/">
            <img
              src={websiteConfig?.logoUrl}
              alt={websiteConfig?.siteName || 'Logo'}
              className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-sm shadow-sm object-contain ml-2 md:ml-8"
            />

            {isDesktop && (
              <span className="l-2 text-xl md:text-2xl font-semibold text-black dark:text-white whitespace-nowrap transition-all duration-500 ease-in-out overflow-hidden inline-block">
                {websiteConfig?.siteName}
              </span>
            )}
          </Link>
        </Col>

        {isDesktop && (
          <Col lg={12} className="flex items-center justify-center">
            <nav className="header__nav">
              <ul className="header__nav__list">
                {navItems.map(item => (
                  <li key={item.path} className="header__nav__item">
                    <NavLink to={item.path} className="dark:text-white">
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </Col>
        )}

        <Col xs={12} sm={16} md={18} lg={6} className="flex justify-end items-center gap-1">
          <div className="header__action">
            <div className={`header__action__search ${isDesktop ? '' : 'max-w-[160px]'}`}>
              <SearchSuggest />
            </div>

            {isLoggedIn && (
              <div className="header__action__wishlist">
                <Link to="/wishlist" title="Yêu thích">
                  <button className="header__action__wishlist--btn">
                    <Badge
                      style={{ transition: 'all 0.1s' }}
                      offset={[5, -5]}
                      size="small"
                      count={wishlistItems.length}
                      overflowCount={99}
                      styles={{
                        indicator: {
                          background: wishlistActiveColor,
                          boxShadow: '0 0 0 1px #ffffff'
                        }
                      }}
                    >
                      <span className="header__action__icon-slot">
                        <HeartOutlined className="header__action__wishlist--icon" />
                      </span>
                    </Badge>
                  </button>
                </Link>
              </div>
            )}

            {isLoggedIn && (
              <div className="header__action__cart">
                <Link to="/cart">
                  <button className="header__action__cart--btn">
                    <Badge
                      style={{ transition: 'all 0.1s' }}
                      offset={[5, -5]}
                      size="small"
                      count={cartItems.length}
                      overflowCount={999}
                    >
                      <span className="header__action__icon-slot">
                        <ShoppingCartOutlined className="header__action__cart--icon" />
                      </span>
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
                open={accountMenuOpen}
                onOpenChange={handleAccountMenuOpenChange}
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
                    <UserOutlined style={{ fontSize: '20px' }} />
                  )}
                </button>
              </Dropdown>
            </div>
          </div>
        </Col>
      </Row>

      {/* Hàng dưới: nav mobile ngang cuộn */}
      {!isDesktop && (
        <div className="header__nav-mobile flex gap-2 overflow-x-auto px-3 py-2 border-t border-gray-200 dark:border-gray-700">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap 
                ${isActive ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}

export default Header
