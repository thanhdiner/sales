import { NavLink } from 'react-router-dom'
import { navItems } from './constants'

export default function MobileNav() {
  return (
    <div className="header__nav-mobile flex gap-2 overflow-x-auto px-3 py-2 border-t border-gray-200 dark:border-gray-700">
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
              isActive
                ? 'bg-indigo-500 text-white dark:bg-green-500 dark:text-[#06110a]'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}
