import { Button, Dropdown, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { authAdminLogout } from '../../../services/adminAuth.service'
import { clearTokens } from '../../../utils/auth'

function UserMenu() {
  const { t } = useTranslation('adminLayout')
  const user = useSelector(state => state.adminUser.user)
  const avatarUrl = user?.avatarUrl
  const fullName = user?.fullName
  const navigate = useNavigate()

  const handleMenuClick = async e => {
    if (e.key === 'logout') {
      try {
        await authAdminLogout()
        clearTokens()
        message.success(t('userMenu.logoutSuccess'))
        navigate('/admin/auth/login')
      } catch {
        message.error(t('userMenu.logoutError'))
      }
      return
    }

    if (e.key === 'profile') {
      navigate('/admin/profile')
      return
    }

    if (e.key === 'settings') {
      navigate('/admin/settings')
    }
  }

  const items = [
    { key: 'profile', label: <span>{t('userMenu.profile')}</span> },
    { key: 'settings', label: <span>{t('userMenu.settings')}</span> },
    { key: 'logout', label: <span className="admin-user-menu-logout">{t('userMenu.logout')}</span> }
  ]

  return (
    <Dropdown
      menu={{ items, onClick: handleMenuClick }}
      placement="bottomRight"
      trigger={['click']}
      overlayClassName="admin-user-menu-dropdown"
      overlayStyle={{ padding: 0, background: 'transparent', border: 0, boxShadow: 'none' }}
    >
      <Button type="text" className="admin-user-menu-trigger inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full p-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt={t('userMenu.avatarAlt')} className="admin-user-avatar h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="admin-user-avatar-fallback flex h-10 w-10 items-center justify-center rounded-full text-[22px] font-bold">
            {fullName?.trim()?.split(' ').pop()?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
      </Button>
    </Dropdown>
  )
}

export default UserMenu
