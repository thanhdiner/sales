import { Card } from 'antd'
import { ApiOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import ChatbotRuntimeForm from './ChatbotRuntimeForm'
import ChatbotRuntimeStatus from './ChatbotRuntimeStatus'

export default function ChatbotRuntimeContent({
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
  const { t } = useTranslation('adminChatbotRuntime')

  return (
    <Card
      title={(
        <span className="flex items-center gap-2">
          <ApiOutlined /> {t('content.title')}
        </span>
      )}
      className="admin-chatbot-card"
    >
      <ChatbotRuntimeStatus config={config} />

      <ChatbotRuntimeForm
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
