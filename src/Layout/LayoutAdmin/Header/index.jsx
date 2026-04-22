import { MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NotificationBell from '@/components/NotificationBell'
import UserMenu from './UserMenu'

function Header({ collapsed, setCollapsed, onNewOrder }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
    const isDark = savedTheme === 'true' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)

    setIsDarkMode(isDark)

    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode

    setIsDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())

    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <header className="sticky top-0 z-[1234] flex items-center justify-between border-b border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900 md:px-5 md:py-3 md:shadow-none">
      <div className="flex items-center gap-2">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        />

        <button
          type="button"
          onClick={() => navigate('/admin/dashboard')}
          className="cursor-pointer border-0 bg-transparent p-0 text-base font-semibold text-gray-900 dark:text-gray-100 md:hidden"
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
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        />

        <NotificationBell onNewOrder={onNewOrder} />

        <UserMenu />
      </div>
    </header>
  )
}

export default Header