import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import useAdminChatbotRuntimePage from './hooks/useAdminChatbotRuntimePage'
import AdminChatbotRuntimeContentSection from './sections/AdminChatbotRuntimeContentSection'
import AdminChatbotRuntimeHeaderSection from './sections/AdminChatbotRuntimeHeaderSection'
import AdminChatbotRuntimeLoadingState from './sections/AdminChatbotRuntimeLoadingState'
import '@/pages/AdminChatbotShared/AdminChatbotTheme.scss'

export default function AdminChatbotRuntimePage() {
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
  } = useAdminChatbotRuntimePage()

  if (loading) {
    return <AdminChatbotRuntimeLoadingState />
  }

  return (
    <div className="admin-chatbot-page mx-auto max-w-7xl">
      <SEO title={t('seo.title')} noIndex />

      <AdminChatbotRuntimeHeaderSection
        saving={saving}
        onReload={handleReload}
        onSave={handleSave}
      />

      <AdminChatbotRuntimeContentSection
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
