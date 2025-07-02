import { AppstoreOutlined, HomeOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function SiderLayout({ collapsed, showLogoText, location }) {
  const navigate = useNavigate()
  const [stateOpenKeys, setStateOpenKeys] = useState([])

  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label
    }
  }

  const menuItems = [
    getItem('Dashboard', 'dashboard', <HomeOutlined />),
    getItem('Products & Categories', 'products&categories', <AppstoreOutlined />, [
      getItem('Products', 'products'),
      getItem('Categories', 'product-categories')
    ])
  ]

  const getLevelKeys = items1 => {
    const key = {}
    const func = (items2, level = 1) => {
      items2.forEach(item => {
        if (item.key) key[item.key] = level
        if (item.children) func(item.children, level + 1)
      })
    }
    func(items1)
    return key
  }
  const levelKeys = getLevelKeys(menuItems)

  useEffect(() => {
    const openKeys = []
    menuItems.forEach(item => {
      if (item.children) {
        item.children.forEach(subItem => {
          if (location.pathname.includes(subItem.key)) openKeys.push(item.key)
        })
      }
    })
    setStateOpenKeys(openKeys)
  }, [location.pathname])

  const onOpenChange = openKeys => {
    const currentOpenKey = openKeys.find(key => stateOpenKeys.indexOf(key) === -1)
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys.filter(key => key !== currentOpenKey).findIndex(key => levelKeys[key] === levelKeys[currentOpenKey])
      setStateOpenKeys(openKeys.filter((_, index) => index !== repeatIndex).filter(key => levelKeys[key] <= levelKeys[currentOpenKey]))
    } else setStateOpenKeys(openKeys)
  }

  return (
    <Sider theme="light" width="235px" trigger={null} collapsible collapsed={collapsed}>
      <Link to={'/admin/dashboard'}>
        <div className={`logo-admin ${collapsed ? 'collapsed' : ''}`}>
          <img src="/logo/logo.png" alt="Diner" className="logo-icon" />
          <span className={`logo-text ${!showLogoText ? 'hide' : ''}`}>Diner Store</span>
        </div>
      </Link>

      <Menu
        onClick={({ key }) => navigate(`/admin/${key}`)}
        mode="inline"
        selectedKeys={[location.pathname.replace('/admin/', '')]}
        items={menuItems}
        onOpenChange={onOpenChange}
        openKeys={stateOpenKeys}
      />
    </Sider>
  )
}

export default SiderLayout
