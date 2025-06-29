import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'

function Header({ colorBgContainer, collapsed, setCollapsed }) {
  const items = [
    { key: 'profile', label: <span>Thông tin cá nhân</span> },
    { key: 'settings', label: <span>Cài đặt</span> },
    { key: 'logout', label: <span>Đăng xuất</span> }
  ]

  return (
    <header
      style={{ background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '20px' }}
    >
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
            <img className="header-avatar" src="https://i.pinimg.com/474x/68/8a/1f/688a1f972abe2aaa9b112a6064f455c2.jpg" alt="Avatar" />
          </Button>
        </Dropdown>
      </div>
    </header>
  )
}

export default Header
