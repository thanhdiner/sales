import { Card } from 'antd'
import { ApiOutlined } from '@ant-design/icons'
import AdminChatbotRuntimeFormSection from './AdminChatbotRuntimeFormSection'
import AdminChatbotRuntimeStatusSection from './AdminChatbotRuntimeStatusSection'

export default function AdminChatbotRuntimeContentSection({
  form,
  config,
  testing,
  testResult,
  selectedProvider,
  currentModels,
  providerOptions,
  onProviderChange,
  onTest
}) {
  return (
    <Card
      title={(
        <span className="flex items-center gap-2">
          <ApiOutlined /> Runtime và provider
        </span>
      )}
      className="dark:border-gray-700 dark:bg-gray-800"
    >
      <AdminChatbotRuntimeStatusSection config={config} />

      <AdminChatbotRuntimeFormSection
        form={form}
        testing={testing}
        testResult={testResult}
        selectedProvider={selectedProvider}
        currentModels={currentModels}
        providerOptions={providerOptions}
        onProviderChange={onProviderChange}
        onTest={onTest}
      />
    </Card>
  )
}
