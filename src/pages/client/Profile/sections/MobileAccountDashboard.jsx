import { FileDoneOutlined, FileSearchOutlined, GiftOutlined, HeartOutlined, MessageOutlined, SettingOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { getAvatarFallback } from '../utils/profileUtils'

const orderItems = [
  { key: 'pending', path: '/orders?status=pending', Icon: FileSearchOutlined },
  { key: 'processing', path: '/orders?status=confirmed', Icon: ShoppingOutlined },
  { key: 'completed', path: '/orders?status=completed', Icon: FileDoneOutlined },
  { key: 'reviews', path: '/orders?status=completed', Icon: MessageOutlined }
]

const utilityItems = [
  { key: 'settings', path: '/settings', Icon: SettingOutlined },
  { key: 'profile', path: '/user/profile', Icon: UserOutlined },
  { key: 'coupons', path: '/coupons', Icon: GiftOutlined },
  { key: 'wishlist', path: '/wishlist', Icon: HeartOutlined }
]

function MobileAccountDashboard({ avatarPreview, inputRef, onFileChange, t, user }) {
  const displayName = user.fullName || user.username
  const avatarSrc = avatarPreview || user.avatar

  return (
    <div className="mb-7 space-y-3 lg:hidden">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-sm dark:border dark:border-white/10 dark:bg-gray-900 dark:bg-none">
        <div className="px-4 pb-3 pt-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white/70 bg-white/20 text-lg font-semibold dark:border-white/10 dark:bg-white/10"
              onClick={() => inputRef.current.click()}
              aria-label={t('avatar.change')}
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt={t('avatar.alt')} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center">{getAvatarFallback(user, t('avatar.fallback'))}</span>
              )}
            </button>

            <div className="min-w-0 flex-1">
              <h2 className="mb-0.5 truncate text-base font-semibold">{displayName}</h2>
              <p className="mb-0.5 truncate text-sm text-white/80">@{user.username}</p>
              <p className="mb-0 flex items-center gap-1.5 text-xs text-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                {t('mobileDashboard.statusActive')}
              </p>
            </div>
          </div>
        </div>

        <Link to="/settings" className="mx-4 mb-4 flex items-center justify-between rounded-xl bg-white/95 px-3.5 py-2.5 text-sm font-medium text-gray-800 shadow-sm dark:bg-gray-900/80 dark:text-gray-100 dark:ring-1 dark:ring-white/10">
          <span className="flex items-center gap-2"><GiftOutlined className="text-blue-600 dark:text-blue-300" />{t('mobileDashboard.settingsHint')}</span>
          <span className="text-gray-400 dark:text-gray-500">›</span>
        </Link>
      </section>

      <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="!hidden" />

      <section className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="mb-0 text-base font-semibold text-gray-900 dark:text-white">{t('mobileDashboard.orders.title')}</h3>
          <Link to="/orders" className="text-sm text-gray-500 dark:text-gray-300">{t('mobileDashboard.orders.viewAll')} ›</Link>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {orderItems.map(({ key, path, Icon }) => (
            <Link key={key} to={path} className="flex flex-col items-center gap-2 rounded-xl p-2 text-center text-gray-700 transition hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50">
              <Icon className="text-2xl" />
              <span className="text-xs leading-4">{t(`mobileDashboard.orders.items.${key}`)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
        <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">{t('mobileDashboard.utilities.title')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {utilityItems.map(({ key, path, Icon }) => (
            <Link key={key} to={path} className="flex flex-col items-center gap-2 rounded-xl p-2 text-center text-gray-700 transition hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50">
              <Icon className="text-2xl" />
              <span className="text-xs leading-4">{t(`mobileDashboard.utilities.items.${key}`)}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default MobileAccountDashboard
