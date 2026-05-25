import { Dropdown } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isNavItemActive, primaryNavItems, secondaryNavItems } from './constants'

export default function HeaderNav() {
  const { t, i18n } = useTranslation('clientHeader')
  const location = useLocation()
  const isVietnamese = (i18n.resolvedLanguage || i18n.language || '').toLowerCase().startsWith('vi')
  const secondaryNavActive = secondaryNavItems.some(item => isNavItemActive(location.pathname, item.path))

  const secondaryMenuItems = secondaryNavItems.map(item => ({
    key: item.path,
    label: <Link to={item.path}>{t(item.labelKey)}</Link>
  }))

  return (
    <nav className={`header__nav${isVietnamese ? ' header__nav--vi' : ''}`}>
      <ul className="header__nav__list">
        {primaryNavItems.map(item => (
          <li key={item.path} className="header__nav__item">
            <NavLink to={item.path} className="dark:text-white">
              {t(item.labelKey)}
            </NavLink>
          </li>
        ))}
        <li className="header__nav__item">
          <Dropdown
            menu={{ items: secondaryMenuItems }}
            overlayClassName="header-nav-more-dropdown"
            placement="bottom"
            trigger={['click']}
          >
            <button
              type="button"
              className={`header__nav__more-trigger dark:text-white${secondaryNavActive ? ' header__nav__more-trigger--active' : ''}`}
              aria-label={t('nav.more')}
            >
              <span>{t('nav.more')}</span>
              <DownOutlined className="header__nav__more-caret" />
            </button>
          </Dropdown>
        </li>
      </ul>
    </nav>
  )
}
