import { useEffect, useState } from 'react'
import { message } from 'antd'
import {
  GlobalOutlined,
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
import { useTranslation } from 'react-i18next'
import { clearClientSessionState } from '@/lib/clientCache'
import { userLogout } from '@/services/userService'
import { setDarkMode } from '@/stores/darkModeSlice'
import { setLanguage } from '@/stores/languageSlice'
import { clearClientTokens, clearClientTokensSession } from '@/utils/auth'

export default function useAccountMenu(user, { headerHidden = false } = {}) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation('common')

  const darkMode = useSelector(state => !!state.darkMode?.value)
  const language = useSelector(state => state.language?.value || 'vi')
  const isLoggedIn = !!user

  useEffect(() => {
    if (headerHidden) {
      setAccountMenuOpen(false)
    }
  }, [headerHidden])

  const themeMenuItem = {
    key: 'theme',
    icon: darkMode ? <MoonOutlined /> : <SunOutlined />,
    label: (
      <div className="flex min-w-[170px] items-center justify-between gap-3">
        <span>{t('theme.darkMode')}</span>
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

  const languageMenuItem = {
    key: 'language',
    icon: <GlobalOutlined />,
    label: (
      <div className="flex min-w-[170px] items-center justify-between gap-3">
        <span>{t('language.label')}</span>
        <span className="rounded-full border border-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200">
          {language === 'vi' ? 'VI' : 'EN'}
        </span>
      </div>
    )
  }

  const guestMenuItems = [
    { key: 'signin', label: t('account.signIn'), icon: <LoginOutlined /> },
    { key: 'signup', label: t('account.signUp'), icon: <UserAddOutlined /> },
    { type: 'divider' },
    themeMenuItem,
    languageMenuItem
  ]

  const userMenuItems = [
    { key: 'profile', label: t('account.profile'), icon: <UserOutlined /> },
    { key: 'orders', label: t('account.orders'), icon: <ShoppingCartOutlined /> },
    { key: 'wishlist', label: t('account.wishlist'), icon: <HeartOutlined /> },
    { key: 'settings', label: t('account.settings'), icon: <SettingOutlined /> },
    themeMenuItem,
    languageMenuItem,
    { type: 'divider' },
    {
      key: 'logout',
      label: t('account.logout'),
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

    if (key === 'language') {
      dispatch(setLanguage(language === 'vi' ? 'en' : 'vi'))
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
        message.success(t('account.logoutSuccess'))
      } catch {
        message.warning(t('account.logoutWarning'))
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
    if (nextOpen && headerHidden) {
      return
    }

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
