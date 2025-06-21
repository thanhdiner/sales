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

  const breadcrumbItems = [
    ...pathSnippets.map((segment, i) => {
      const url = `/${pathSnippets.slice(0, i + 1).join('/')}`
      const isLast = i === pathSnippets.length - 1
      return (
        <Breadcrumb.Item key={url}>
          {isLast ? (
            <span style={{ fontWeight: '600', color: '#1677ff', textTransform: 'capitalize' }}>{segment}</span>
          ) : (
            <Link to={url} style={{ textTransform: 'capitalize' }}>
              {segment}
            </Link>
          )}
        </Breadcrumb.Item>
      )
    })
  ]

  const [showLogoText, setShowLogoText] = useState(true)

  useEffect(() => {
    if (collapsed) setTimeout(() => setShowLogoText(false), 100)
    else setShowLogoText(true)
  }, [collapsed])

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboard'
    },
    {
      key: 'products',
      icon: <AppstoreOutlined />,
      label: 'Products Management'
    }
  ]

  const items = [
    { key: 'profile', label: <span>Thông tin cá nhân</span> },
    { key: 'settings', label: <span>Cài đặt</span> },
    { key: 'logout', label: <span>Đăng xuất</span> }
  ]

  const activeKey = menuItems.find(item => location.pathname.includes(`/admin/${item.key}`))?.key || 'dashboard'

  return (
    <div>
      <Layout>
        <Sider theme="light" width="220px" trigger={null} collapsible collapsed={collapsed}>
          <Link to={'/admin/dashboard'}>
            <div className={`logo-admin ${collapsed ? 'collapsed' : ''}`}>
              <img src="/logo/logo.png" alt="Diner" className="logo-icon" />
              <span className={`logo-text ${!showLogoText ? 'hide' : ''}`}>Diner Store</span>
            </div>
          </Link>

          <Menu onClick={({ key }) => navigate(key)} mode="inline" selectedKeys={[activeKey]} items={menuItems} />
        </Sider>
        <Layout>
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
          <Breadcrumb style={{ margin: '10px 16px 0' }}>{breadcrumbItems}</Breadcrumb>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
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
