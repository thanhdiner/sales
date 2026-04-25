import useAdminChatbotConfigPage from './hooks/useAdminChatbotConfigPage'
import AdminChatbotConfigFormSection from './sections/AdminChatbotConfigFormSection'
import AdminChatbotConfigHeaderSection from './sections/AdminChatbotConfigHeaderSection'
import AdminChatbotConfigLoadingState from './sections/AdminChatbotConfigLoadingState'
import AdminChatbotConfigOverviewSection from './sections/AdminChatbotConfigOverviewSection'
import AdminChatbotConfigStatsSection from './sections/AdminChatbotConfigStatsSection'
import '@/pages/AdminChatbotShared/AdminChatbotTheme.scss'

export default function AdminChatbotConfigPage() {
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
  } = useAdminChatbotConfigPage()

  if (loading) {
    return <AdminChatbotConfigLoadingState />
  }

  return (
    <div className="admin-chatbot-page mx-auto max-w-7xl">
      <AdminChatbotConfigHeaderSection
        saving={saving}
        onReload={handleReload}
        onSave={handleSave}
      />

      <AdminChatbotConfigStatsSection
        agentEnabled={agentEnabled}
        runtimeProvider={runtimeProvider}
        runtimeModel={runtimeModel}
        enabledTools={enabledTools}
        totalTools={totalTools}
      />

      <AdminChatbotConfigOverviewSection />

      <AdminChatbotConfigFormSection form={form} />
    </div>
  )
}
