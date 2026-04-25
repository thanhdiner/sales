import { NavLink } from 'react-router-dom'
import { navItems } from './constants'

export default function HeaderNav() {
  return (
    <nav className="header__nav">
      <ul className="header__nav__list">
        {navItems.map(item => (
          <li key={item.path} className="header__nav__item">
            <NavLink to={item.path} className="dark:text-white">
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
