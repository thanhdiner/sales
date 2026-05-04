import { AppstoreOutlined, FileTextOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'

const accountHubItems = [
  { key: 'profile', path: '/user/profile', Icon: UserOutlined },
  { key: 'settings', path: '/settings', Icon: SettingOutlined },
  { key: 'orders', path: '/orders', Icon: FileTextOutlined },
  { key: 'products', path: '/products', Icon: AppstoreOutlined }
]

function AccountHub({ t }) {
  return (
    <section className="mb-7 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-5">
      <div className="mb-4">
        <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">{t('accountHub.title')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('accountHub.description')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {accountHubItems.map(({ key, path, Icon }) => (
          <NavLink
            key={key}
            to={path}
            className={({ isActive }) =>
              `group rounded-xl border p-4 transition-colors ${
                isActive
                  ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-white dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300 dark:hover:bg-gray-800'
              }`
            }
          >
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg shadow-sm transition-colors group-hover:text-blue-600 dark:bg-gray-800">
              <Icon />
            </span>
            <span className="block text-sm font-semibold">{t(`accountHub.items.${key}.title`)}</span>
            <span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">{t(`accountHub.items.${key}.description`)}</span>
          </NavLink>
        ))}
      </div>
    </section>
  )
}

export default AccountHub
