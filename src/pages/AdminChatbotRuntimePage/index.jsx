import useAdminChatbotRuntimePage from './hooks/useAdminChatbotRuntimePage'
import AdminChatbotRuntimeContentSection from './sections/AdminChatbotRuntimeContentSection'
import AdminChatbotRuntimeHeaderSection from './sections/AdminChatbotRuntimeHeaderSection'
import AdminChatbotRuntimeLoadingState from './sections/AdminChatbotRuntimeLoadingState'

export default function AdminChatbotRuntimePage() {
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
    <div className="mx-auto max-w-7xl">
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
