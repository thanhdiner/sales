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
        <Layout className="layout-default__body">
          <Sider width={250} className="layout-default__sider">
            <MenuSider className="layout-default__menu__sider" />
          </Sider>
          <Layout>
            <Content className="layout-default__content">
              <Outlet />
            </Content>
            <Footer />
          </Layout>
        </Layout>
      </Layout>
    </>
  )
}

export default LayoutDefault
