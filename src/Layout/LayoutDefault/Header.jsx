import { Badge, Col, Input, Modal, Row } from 'antd'
import { Link, NavLink } from 'react-router-dom'
import { SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { useState } from 'react'

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const onCancel = () => {
    setIsModalOpen(false)
  }

  const navItems = [
    {
      label: 'Home',
      path: '/'
    },
    {
      label: 'Products',
      path: '/products'
    },
    {
      label: 'Events',
      path: '/events'
    },
    {
      label: 'About',
      path: '/about'
    },
    {
      label: 'Contact',
      path: '/contact'
    },
    {
      label: 'Blog',
      path: '/blog'
    }
  ]

  return (
    <>
      <header className="header">
        <Row>
          <Col span={6}>
            <Link className="header__logo--wrap" to="/">
              <img className="header__logo" src="/logo/logo.png" alt="Logo" />
              <span className="header__logo__name">
                <span className="header__logo__name--first">Diner</span> <span className="header__logo__name--second">Store</span>
              </span>
            </Link>
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} span={12}>
            <nav className="header__nav">
              <ul className="header__nav__list">
                {navItems.map(item => (
                  <li key={item.path} className="header__nav__item">
                    <NavLink to={item.path}>{item.label}</NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </Col>
          <Col span={6}>
            <div className="header__action">
              <div className="header__action__search">
                <div className="header__action__search--wrap">
                  <Input placeholder="Search Product..." className="header__action__search--input" />
                  <button className="header__action__search--btn">
                    <SearchOutlined style={{ fontSize: '22px' }} />
                  </button>
                </div>
              </div>
              <div className="header__action__cart">
                <Link>
                  <button className="header__action__cart--btn">
                    <Badge style={{ transition: 'all 0.1s' }} offset={[5, -5]} size="small" count={123} overflowCount={999}>
                      <ShoppingCartOutlined className="header__action__cart--icon" style={{ fontSize: '22px' }} />
                    </Badge>
                  </button>
                </Link>
              </div>
              <div className="header__action__account">
                <button className="header__action__account--btn" onClick={showModal}>
                  <UserOutlined style={{ fontSize: '22px' }} />
                </button>
                <Modal title="Đăng ký" open={isModalOpen} onCancel={onCancel}>
                  <p>Test đăng ký</p>
                </Modal>
              </div>
            </div>
          </Col>
        </Row>
      </header>
    </>
  )
}

export default Header
