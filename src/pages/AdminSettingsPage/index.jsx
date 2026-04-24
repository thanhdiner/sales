import { Tabs } from 'antd'
import { useSearchParams } from 'react-router-dom'
import AdminSecurityTab from './components/AdminSecurityTab'
import AdminWebsiteConfigTab from './components/AdminWebsiteConfigTab'

const AdminSettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('setting') || 'security'

  const handleTabChange = (key) => {
    const params = new URLSearchParams(searchParams)
    params.set('setting', key)
    setSearchParams(params, { replace: true })
  }

  return (
    <Tabs
      activeKey={activeTab}
      onChange={handleTabChange}
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
