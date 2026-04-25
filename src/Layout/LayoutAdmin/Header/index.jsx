import { MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import NotificationBell from './components/NotificationBell'
import UserMenu from './UserMenu'
import useDarkMode from './useDarkMode'

function Header({ collapsed, setCollapsed, onNewOrder }) {
  const navigate = useNavigate()
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <header className="admin-header sticky top-0 z-[1234] flex items-center justify-between px-3 py-2 shadow-sm md:px-5 md:py-3 md:shadow-none">
      <div className="flex items-center gap-2">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="admin-header-icon-btn flex h-9 w-9 items-center justify-center rounded-lg"
        />

        <button
          type="button"
          onClick={() => navigate('/admin/dashboard')}
          className="admin-header-brand cursor-pointer border-0 bg-transparent p-0 text-base font-semibold md:hidden"
        >
          Admin
        </button>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2">
        <Button
          type="text"
          icon={isDarkMode ? <SunOutlined className="text-[20px]" /> : <MoonOutlined className="text-[20px]" />}
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          className="admin-header-icon-btn flex h-10 w-10 items-center justify-center rounded-lg"
        />

        <NotificationBell onNewOrder={onNewOrder} />

        <UserMenu />
      </div>
    </header>
  )
}

export default Header
