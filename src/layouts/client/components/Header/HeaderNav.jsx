import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { navItems } from './constants'

export default function HeaderNav() {
  const { t } = useTranslation('clientHeader')

  return (
    <nav className="header__nav">
      <ul className="header__nav__list">
        {navItems.map(item => (
          <li key={item.path} className="header__nav__item">
            <NavLink to={item.path} className="dark:text-white">
              {t(item.labelKey)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}