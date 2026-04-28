import { Badge, Col } from 'antd'
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { normalizeWishlistItems } from '@/lib/normalizeWishlistItems'
import { useSelector } from 'react-redux'
import NotificationBell from '../components/NotificationBell'
import AccountMenu from './AccountMenu'
import HeaderSearch from './HeaderSearch'

export default function HeaderActions({ isDesktop, user, notifications, setNotifications }) {
  const cartItems = useSelector(state => state.cart.items) || []
  const wishlistItems = useSelector(state => normalizeWishlistItems(state.wishlist.items))
  const isLoggedIn = !!user
  const wishlistActiveColor = '#ff424e'

  return (
    <Col xs={10} sm={14} md={16} lg={10} xl={10} className="flex justify-end items-center gap-1">
      <div className="header__action">
        {isDesktop && (
          <div className="header__action__search">
            <HeaderSearch />
          </div>
        )}

        {!isDesktop && <HeaderSearch mode="mobile" />}

        {isLoggedIn && (
          <div className="header__action__wishlist">
            <Link to="/wishlist" title="Yêu thích">
              <button className="header__action__wishlist--btn">
                <Badge
                  style={{ transition: 'all 0.1s' }}
                  offset={[5, -5]}
                  size="small"
                  count={wishlistItems.length}
                  overflowCount={99}
                  styles={{
                    indicator: {
                      background: wishlistActiveColor,
                      boxShadow: '0 0 0 1px #ffffff'
                    }
                  }}
                >
                  <span className="header__action__icon-slot">
                    <HeartOutlined className="header__action__wishlist--icon" />
                  </span>
                </Badge>
              </button>
            </Link>
          </div>
        )}

        {isLoggedIn && (
          <div className="header__action__cart">
            <Link to="/cart" title="Giỏ hàng" aria-label="Giỏ hàng">
              <button className="header__action__cart--btn" title="Giỏ hàng" aria-label="Giỏ hàng">
                <Badge style={{ transition: 'all 0.1s' }} offset={[5, -5]} size="small" count={cartItems.length} overflowCount={999}>
                  <span className="header__action__icon-slot">
                    <ShoppingCartOutlined className="header__action__cart--icon" />
                  </span>
                </Badge>
              </button>
            </Link>
          </div>
        )}

        {isLoggedIn && <NotificationBell notifications={notifications} setNotifications={setNotifications} />}

        <AccountMenu user={user} />
      </div>
    </Col>
  )
}
