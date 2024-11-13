import { Badge, Col, Input, Menu, Modal, Row } from 'antd'
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

  return (
    <>
      <header className="header">
        <Row>
          <Col span={6}>
            <NavLink className="header__logo--wrap" to="/">
              <img className="header__logo" src="/logo/logo.svg" alt="Logo" />
              <span className="header__logo__name">
                <span className="header__logo__name--first">Diner</span> <span className="header__logo__name--second">Store</span>
              </span>
            </NavLink>
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} span={12}>
            <nav className="header__nav">
              <ul className="header__nav__list">
                <li className="header__nav__item">
                  <NavLink to="/" end>
                    Home
                  </NavLink>
                </li>
                <li className="header__nav__item">
                  <NavLink to="/products">Products</NavLink>
                </li>
                <li className="header__nav__item">
                  <NavLink to="/events">Events</NavLink>
                </li>
                <li className="header__nav__item">
                  <NavLink to="/about">About</NavLink>
                </li>
                <li className="header__nav__item">
                  <NavLink to="/contact">Contact</NavLink>
                </li>
                <li className="header__nav__item">
                  <NavLink to="/blog">Blog</NavLink>
                </li>
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
                    <Badge motionDurationMid="0.1s" offset={[5, -5]} size="small" count={123} overflowCount={999}>
                      <ShoppingCartOutlined className="header__action__cart--icon" style={{ fontSize: '22px' }} />
                    </Badge>
                  </button>
                </Link>
              </div>
              <div className="header__action__account">
                <Menu style={{ background: 'transparent' }}>
                  <button className="header__action__account--btn" onClick={showModal}>
                    <UserOutlined style={{ fontSize: '22px' }} />
                  </button>
                  <Modal title="Đăng ký" open={isModalOpen} onCancel={onCancel}>
                    <p>Test đăng ký</p>
                  </Modal>
                </Menu>
              </div>
            </div>
          </Col>
        </Row>
      </header>
    </>
  )
}

export default Header
