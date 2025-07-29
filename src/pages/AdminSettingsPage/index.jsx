import { Tabs } from 'antd'
import AdminSecurityTab from '@/components/AdminSecurityTab'
import AdminWebsiteConfigTab from '@/components/AdminWebsiteConfigTab'
import titles from '@/utils/titles'

const AdminSettingsPage = () => {
  titles('Settings')

  return (
    <Tabs
      defaultActiveKey="security"
      className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
      items={[
        {
          key: 'security',
          label: <span className="dark:text-gray-200">Security</span>,
          children: <AdminSecurityTab />
        },
        {
          key: 'configuration',
          label: <span className="dark:text-gray-200">Configuration</span>,
          children: <AdminWebsiteConfigTab />
        }
      ]}
    />
  )
}

export default AdminSettingsPage
