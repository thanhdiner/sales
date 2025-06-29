import { AppstoreOutlined, HomeOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Link, useNavigate } from 'react-router-dom'

function SiderLayout({ collapsed, showLogoText, location }) {
  const navigate = useNavigate()

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
      />
    </Sider>
  )
}

export default SiderLayout
