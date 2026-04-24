import { Button, Typography } from 'antd'

const { Title } = Typography

export default function AdminAccountsHeaderSection({ onCreate }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Title level={3} className="m-0 text-gray-900 dark:text-gray-200">
        Accounts Management
      </Title>

      <Button
        type="primary"
        onClick={onCreate}
        className="w-full rounded-md bg-gradient-to-r from-blue-500 to-blue-600 p-2 text-white sm:w-auto"
      >
        Thêm tài khoản
      </Button>
    </div>
  )
}
