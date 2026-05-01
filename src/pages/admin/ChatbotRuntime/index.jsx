import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import useChatbotRuntime from './hooks/useChatbotRuntime'
import ChatbotRuntimeContent from './sections/ChatbotRuntimeContent'
import ChatbotRuntimeHeader from './sections/ChatbotRuntimeHeader'
import ChatbotRuntimeLoadingState from './sections/ChatbotRuntimeLoadingState'
import '@/pages/admin/ChatbotShared/ChatbotTheme.scss'

export default function ChatbotRuntime() {
  const { t } = useTranslation('adminChatbotRuntime')
  const {
    form,
    loading,
    saving,
    testing,
    config,
    testResult,
    selectedProvider,
    currentModels,
    providerOptions,
    handleReload,
    handleSave,
    handleTest,
    handleProviderChange
  } = useChatbotRuntime()

  if (loading) {
    return <ChatbotRuntimeLoadingState />
  }

  return (
    <div className="admin-chatbot-page mx-auto max-w-7xl">
      <SEO title={t('seo.title')} noIndex />

      <ChatbotRuntimeHeader
        saving={saving}
        onReload={handleReload}
        onSave={handleSave}
      />

      <ChatbotRuntimeContent
        form={form}
        config={config}
        testing={testing}
        testResult={testResult}
        selectedProvider={selectedProvider}
        currentModels={currentModels}
        providerOptions={providerOptions}
        onProviderChange={handleProviderChange}
        onTest={handleTest}
      />
    </div>
  )
}
