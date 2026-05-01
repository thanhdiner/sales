import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import useChatbotConfig from './hooks/useChatbotConfig'
import ChatbotConfigForm from './sections/ChatbotConfigForm'
import ChatbotConfigHeader from './sections/ChatbotConfigHeader'
import ChatbotConfigLoadingState from './sections/ChatbotConfigLoadingState'
import ChatbotConfigOverview from './sections/ChatbotConfigOverview'
import ChatbotConfigStats from './sections/ChatbotConfigStats'
import '@/pages/admin/ChatbotShared/ChatbotTheme.scss'

export default function ChatbotConfig() {
  const { t } = useTranslation('adminChatbotConfig')
  const {
    form,
    loading,
    saving,
    agentEnabled,
    runtimeProvider,
    runtimeModel,
    enabledTools,
    totalTools,
    handleReload,
    handleSave
  } = useChatbotConfig()

  if (loading) {
    return <ChatbotConfigLoadingState />
  }

  return (
    <div className="admin-chatbot-page mx-auto max-w-7xl">
      <SEO title={t('seo.title')} noIndex />

      <ChatbotConfigHeader
        saving={saving}
        onReload={handleReload}
        onSave={handleSave}
      />

      <ChatbotConfigStats
        agentEnabled={agentEnabled}
        runtimeProvider={runtimeProvider}
        runtimeModel={runtimeModel}
        enabledTools={enabledTools}
        totalTools={totalTools}
      />

      <ChatbotConfigOverview />

      <ChatbotConfigForm form={form} />
    </div>
  )
}
