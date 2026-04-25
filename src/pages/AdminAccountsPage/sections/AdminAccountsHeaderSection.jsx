import { Button, Typography } from 'antd'

const { Title } = Typography

const headerWrapperClass = 'mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'
const titleClass = 'm-0 text-[var(--admin-text)]'
const createButtonClass =
  'w-full rounded-md !border-none !bg-[var(--admin-accent)] p-2 !text-white hover:!opacity-90 sm:w-auto'

export default function AdminAccountsHeaderSection({ onCreate }) {
  return (
    <div className={headerWrapperClass}>
      <Title level={3} className={titleClass}>
        Accounts Management
      </Title>

      <Button type="primary" onClick={onCreate} className={createButtonClass}>
        Thêm tài khoản
      </Button>
    </div>
  )
}