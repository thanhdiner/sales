import { AppstoreOutlined, CrownOutlined, FileTextOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

const mobileNavItems = [
  { labelKey: 'mobileBottomNav.home', path: '/', Icon: HomeOutlined },
  { labelKey: 'mobileBottomNav.products', path: '/products', Icon: AppstoreOutlined },
  { labelKey: 'mobileBottomNav.vip', path: '/vip', Icon: CrownOutlined },
  { labelKey: 'mobileBottomNav.orders', path: '/orders', Icon: FileTextOutlined },
  { labelKey: 'mobileBottomNav.account', path: '/me', Icon: UserOutlined }
]

export default function MobileBottomNav() {
  const { t } = useTranslation('clientHeader')

  return (
    <nav className="mobile-bottom-nav" aria-label={t('mobileBottomNav.ariaLabel')}>
      {mobileNavItems.map(({ labelKey, path, Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) => `mobile-bottom-nav__item${isActive ? ' mobile-bottom-nav__item--active' : ''}`}
        >
          <Icon className="mobile-bottom-nav__icon" />
          <span className="mobile-bottom-nav__label">{t(labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
