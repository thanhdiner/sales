import { Button, Dropdown, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { authAdminLogout } from '../../../services/adminAuth.service'
import { clearTokens } from '../../../utils/auth'
import { useSelector } from 'react-redux'

function UserMenu() {
  const user = useSelector(state => state.user?.user)
  const avatarUrl = user?.avatarUrl
  const fullName = user?.fullName
  const navigate = useNavigate()

  const handleMenuClick = async e => {
    if (e.key === 'logout') {
      try {
        await authAdminLogout()
        clearTokens()
        message.success('Đăng xuất thành công!')
        navigate('/admin/auth/login')
      } catch (err) {
        message.error('Đăng xuất thất bại!')
      }
    } else if (e.key === 'profile') {
      navigate('/admin/profile')
    } else if (e.key === 'settings') {
      navigate('/admin/settings')
    }
  }

  const items = [
    { key: 'profile', label: <span>Personal information</span> },
    { key: 'settings', label: <span>Settings</span> },
    { key: 'logout', label: <span className="text-[red]">Sign out</span> }
  ]
  return (
    <Dropdown menu={{ items, onClick: handleMenuClick }} placement="bottomRight" trigger={['click']}>
      <Button type="text" className="p-0 w-10 h-10 rounded-full overflow-hidden inline-flex items-center justify-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-solid border-[#eee]" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-bold text-[22px] flex items-center justify-center">
            {fullName?.trim()?.split(' ').pop()?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
      </Button>
    </Dropdown>
  )
}

export default UserMenu
