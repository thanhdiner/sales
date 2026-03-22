import { MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useState, useEffect } from 'react'
import UserMenu from './UserMenu'
import { useNavigate } from 'react-router-dom'
import NotificationBell from '@/components/NotificationBell'

function Header({ collapsed, setCollapsed, onNewOrder }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
    const isDark = savedTheme === 'true' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDarkMode(isDark)
    if (isDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  return (
    <header className="sticky top-0 z-[1234] bg-slate-50 dark:bg-gray-800 flex justify-between items-center p-[10px_10px_10px_0] md:p-[15px_20px_15px_0] shadow-sm md:shadow-none">
      <div className="flex items-center gap-1">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="dark:text-white md:mr-1"
        />
        <span onClick={() => navigate('/admin/dashboard')} className="font-semibold text-base md:hidden dark:text-gray-200 cursor-pointer">
          Admin
        </span>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <Button
          type="text"
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          className="dark:text-gray-300"
        />
        {/* Notification Bell — chỉ hiện với admin */}
        <NotificationBell onNewOrder={onNewOrder} />
        <UserMenu />
      </div>
    </header>
  )
}

export default Header
