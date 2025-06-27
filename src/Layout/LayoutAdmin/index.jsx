import { AppstoreOutlined, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Dropdown, Layout, Menu, theme } from 'antd'
import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import Header from './Header'

import './LayoutAdmin.scss'

const { Sider, Content } = Layout

function LayoutAdmin() {
  const [collapsed, setCollapsed] = useState(false)

  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const navigate = useNavigate()
  const location = useLocation()

  const pathSnippets = location.pathname.split('/').filter(i => i)

  const breadcrumbItems = pathSnippets.map((segment, i) => {
    const url = `/${pathSnippets.slice(0, i + 1).join('/')}`
    const isLast = i === pathSnippets.length - 1
    return {
      title: isLast ? (
        <span style={{ fontWeight: '600', color: '#1677ff', textTransform: 'capitalize' }}>{segment}</span>
      ) : (
        <Link to={url} style={{ textTransform: 'capitalize' }}>
          {segment}
        </Link>
      )
    }
  })

  const [showLogoText, setShowLogoText] = useState(true)

  useEffect(() => {
    if (collapsed) setTimeout(() => setShowLogoText(false), 100)
    else setShowLogoText(true)
  }, [collapsed])

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
      getItem('Products', 'products&categories/products'),
      getItem('Categories', 'products/categories')
    ])
  ]

  const items = [
    { key: 'profile', label: <span>Thông tin cá nhân</span> },
    { key: 'settings', label: <span>Cài đặt</span> },
    { key: 'logout', label: <span>Đăng xuất</span> }
  ]

  return (
    <div>
      <Layout>
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
          />
        </Sider>
        <Layout style={{ background: '#fafafa' }}>
          <Header colorBgContainer={colorBgContainer}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64
              }}
            />

            <div>
              <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
                <Button type="text" className="header-avatar-button">
                  <img
                    className="header-avatar"
                    src="https://i.pinimg.com/474x/68/8a/1f/688a1f972abe2aaa9b112a6064f455c2.jpg"
                    alt="Avatar"
                  />
                </Button>
              </Dropdown>
            </div>
          </Header>
          <Breadcrumb style={{ margin: '10px 16px 0' }} items={breadcrumbItems} />
          <Content
            style={{
              margin: '12px 16px 24px',
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default LayoutAdmin
