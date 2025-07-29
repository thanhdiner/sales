import { Breadcrumb, Layout } from 'antd'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Header from './Header'

import SiderLayout from './SiderLayout'

const { Content } = Layout

function LayoutAdmin() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const pathSnippets = location.pathname.split('/').filter(i => i)

  const breadcrumbItems = pathSnippets.map((segment, i) => {
    const url = `/${pathSnippets.slice(0, i + 1).join('/')}`
    const isLast = i === pathSnippets.length - 1
    return {
      title: isLast ? (
        <span className="font-semibold text-[#1677ff] capitalize">{segment}</span>
      ) : (
        <Link to={url} className="capitalize dark:text-gray-300">
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
    <>
      <Layout>
        <SiderLayout {...{ collapsed, showLogoText, location }} />
        <Layout className="bg-gray-100 dark:bg-gray-700">
          <Header {...{ collapsed, setCollapsed }} />
          <Breadcrumb className="mt-2.5 mx-4 mb-0" items={breadcrumbItems} />
          <Content className="mt-3 mx-4 mb-6 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default LayoutAdmin
