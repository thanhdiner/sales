import { useState } from 'react'
import { message } from 'antd'
import {
  HeartOutlined,
  LoginOutlined,
  LogoutOutlined,
  MoonOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  SunOutlined,
  UserAddOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearClientSessionState } from '@/lib/clientCache'
import { userLogout } from '@/services/userService'
import { setDarkMode } from '@/stores/darkModeSlice'
import { clearClientTokens, clearClientTokensSession } from '@/utils/auth'

export default function useAccountMenu(user) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const darkMode = useSelector(state => !!state.darkMode?.value)
  const isLoggedIn = !!user

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
    { key: 'wishlist', label: 'Wishlist', icon: <HeartOutlined /> },
    { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
    themeMenuItem,
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      className: 'header-account-dropdown__logout'
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
      return
    }

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

  const handleAccountMenuOpenChange = (nextOpen, info) => {
    if (!nextOpen && info?.source === 'menu') {
      return
    }

    setAccountMenuOpen(nextOpen)
  }

  return {
    accountMenuOpen,
    menuItems: isLoggedIn ? userMenuItems : guestMenuItems,
    handleMenuClick,
    handleAccountMenuOpenChange
  }
}
