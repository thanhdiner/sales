import { GlobalOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { setLanguage } from '@/stores/app/languageSlice'
import AdminNotificationBell from '@/components/admin/notifications/AdminNotificationBell'
import UserMenu from './components/UserMenu'
import useDarkMode from './hooks/useDarkMode'

function Header({ collapsed, setCollapsed, onNewOrder, canToggleSider = true }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation('adminLayout')
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const language = useSelector(state => state.language?.value || 'vi')
  const nextLanguage = language === 'vi' ? 'en' : 'vi'
  const languageToggleLabel = t('header.switchLanguage', {
    language: t(`header.languages.${nextLanguage}`)
  })

  return (
    <header className="admin-header sticky top-0 z-[1234] flex items-center justify-between px-3 py-2 shadow-sm md:px-5 md:py-3 md:shadow-none">
      <div className="flex items-center gap-2">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          disabled={!canToggleSider}
          title={canToggleSider ? t('header.toggleSidebar') : t('header.sidebarLocked')}
          className="admin-header-icon-btn flex h-9 w-9 items-center justify-center rounded-lg"
        />

        <button
          type="button"
          onClick={() => navigate('/admin/dashboard')}
          className="admin-header-brand cursor-pointer border-0 bg-transparent p-0 text-base font-semibold md:hidden"
        >
          {t('brand.admin')}
        </button>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2">
        <Button
          type="text"
          icon={<GlobalOutlined className="text-[18px]" />}
          onClick={() => dispatch(setLanguage(nextLanguage))}
          aria-label={languageToggleLabel}
          title={languageToggleLabel}
          className="admin-header-icon-btn admin-header-language-btn flex h-10 items-center justify-center rounded-lg"
        >
          {language === 'vi' ? 'VI' : 'EN'}
        </Button>

        <Button
          type="text"
          icon={isDarkMode ? <SunOutlined className="text-[20px]" /> : <MoonOutlined className="text-[20px]" />}
          onClick={toggleDarkMode}
          title={isDarkMode ? t('header.switchToLight') : t('header.switchToDark')}
          aria-label={isDarkMode ? t('header.switchToLight') : t('header.switchToDark')}
          className="admin-header-icon-btn flex h-10 w-10 items-center justify-center rounded-lg"
        />

        <AdminNotificationBell onNewOrder={onNewOrder} />

        <UserMenu />
      </div>
    </header>
  )
}

export default Header
