import { MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useState, useEffect } from 'react'
import UserMenu from './UserMenu'

function Header({ collapsed, setCollapsed }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

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
    <header className="sticky top-0 z-[1234] bg-slate-50 dark:bg-gray-800 flex justify-between items-center p-[15px_20px_15px_0]">
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className="dark:text-white"
      />

      <div className="flex items-center gap-2">
        <Button
          type="text"
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          className="dark:text-gray-300"
        />
        <UserMenu />
      </div>
    </header>
  )
}

export default Header
