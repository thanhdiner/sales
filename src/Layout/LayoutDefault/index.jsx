import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Layout } from 'antd'
import MenuSider from '../../components/MenuSider'
import { Outlet } from 'react-router-dom'
import './LayoutDefault.scss'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCart } from '@/stores/cart'
import { getCart } from '@/services/cartsService'
import { getClientAccessToken, getClientAccessTokenSession } from '@/utils/auth'

const { Content } = Layout

const { Sider } = Layout

function LayoutDefault() {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchCart = async () => {
      const token = getClientAccessToken() || getClientAccessTokenSession()
      if (token) {
        try {
          const cart = await getCart()
          dispatch(setCart(cart.items))
        } catch {
          dispatch(setCart([]))
        }
      } else {
        dispatch(setCart([]))
      }
    }
    fetchCart()
    // eslint-disable-next-line
  }, [dispatch])

  return (
    <>
      <Layout className="layout-default">
        <Header />
        <Layout className="layout-default__body">
          <Sider width={250} className="layout-default__sider">
            <MenuSider className="layout-default__menu__sider" />
          </Sider>
          <Layout className="layout-default__body--sub">
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
