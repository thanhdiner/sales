import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Layout } from 'antd'
import MenuSider from '../../components/MenuSider'
import { Outlet } from 'react-router-dom'
import './LayoutDefault.scss'

const { Content } = Layout

const { Sider } = Layout

function LayoutDefault() {
  return (
    <>
      <Layout className="layout-default">
        <Header />
        <Layout>
          <Sider className="layout-default__sider">
            <MenuSider />
          </Sider>
          <Layout>
            <Content>
              <Outlet />
            </Content>
          </Layout>
        </Layout>
        <Footer />
      </Layout>
    </>
  )
}

export default LayoutDefault
