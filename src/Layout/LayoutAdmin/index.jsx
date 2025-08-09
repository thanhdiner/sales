import { Breadcrumb, Layout } from 'antd'
import { useState } from 'react'
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

  return (
    <>
      <Layout className="min-h-screen">
        {/* Overlay for mobile when menu open */}
        {!collapsed && (
          <div onClick={() => setCollapsed(true)} className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-20 md:hidden animate-fadeIn" />
        )}
        <SiderLayout {...{ collapsed, setCollapsed, location }} />
        <Layout className="bg-gray-100 dark:bg-gray-700 transition-colors">
          <Header {...{ collapsed, setCollapsed }} />
          <Breadcrumb className="mt-2.5 mx-2 md:mx-4 mb-0" items={breadcrumbItems} />
          <Content className="mt-3 mx-2 md:mx-4 mb-6 p-3 sm:p-4 md:p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm transition-all">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default LayoutAdmin
