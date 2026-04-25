import { Dropdown } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import useAccountMenu from './useAccountMenu'

export default function AccountMenu({ user }) {
  const { accountMenuOpen, menuItems, handleMenuClick, handleAccountMenuOpenChange } = useAccountMenu(user)
  const isLoggedIn = !!user

  return (
    <div className="header__action__account">
      <Dropdown
        menu={{
          items: menuItems,
          onClick: handleMenuClick
        }}
        overlayClassName="header-account-dropdown"
        open={accountMenuOpen}
        onOpenChange={handleAccountMenuOpenChange}
        placement="bottomRight"
        arrow
        trigger={['click']}
      >
        <button className="header__action__account--btn">
          {isLoggedIn && user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover border border-solid border-gray-200"
            />
          ) : isLoggedIn && user?.fullName ? (
            <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 font-bold text-[18px] flex items-center justify-center">
              {user.fullName?.trim()?.split(' ').pop()?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          ) : (
            <UserOutlined style={{ fontSize: '20px' }} />
          )}
        </button>
      </Dropdown>
    </div>
  )
}
