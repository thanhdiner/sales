import { Breadcrumb, Layout, theme } from 'antd'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Header from './Header'

import './LayoutAdmin.scss'
import SiderLayout from './SiderLayout'

const { Content } = Layout

function LayoutAdmin() {
  const [collapsed, setCollapsed] = useState(false)

  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

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

  return (
    <div>
      <Layout>
        <SiderLayout {...{ collapsed, showLogoText, location }} />
        <Layout style={{ background: '#fafafa' }}>
          <Header {...{ colorBgContainer, collapsed, setCollapsed }} />
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
