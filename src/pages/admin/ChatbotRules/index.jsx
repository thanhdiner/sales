import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import useChatbotRules from './hooks/useChatbotRules'
import ChatbotRulesContent from './sections/ChatbotRulesContent'
import ChatbotRulesHeader from './sections/ChatbotRulesHeader'
import ChatbotRulesLoadingState from './sections/ChatbotRulesLoadingState'
import ChatbotRulesStats from './sections/ChatbotRulesStats'
import '@/pages/admin/ChatbotShared/ChatbotTheme.scss'
import './index.scss'

export default function ChatbotRules() {
  const { t } = useTranslation('adminChatbotRules')
  const {
    form,
    loading,
    saving,
    panelLoading,
    watchedKeywords,
    watchedRules,
    promptOverrideEnabled,
    keywordInput,
    ruleInput,
    history,
    previewOpen,
    previewPrompt,
    testMessage,
    testResult,
    limits,
    handleReload,
    handleSave,
    handleResetDefaults,
    handlePreviewPrompt,
    handleTestRules,
    handleRollback,
    handleClosePreview,
    handleTestMessageChange,
    handleKeywordInputChange,
    handleRuleInputChange,
    handleAddKeyword,
    handleRemoveKeyword,
    handleAddRule,
    handleRemoveRule
  } = useChatbotRules()

  if (loading) {
    return <ChatbotRulesLoadingState />
  }

  return (
    <div className="admin-chatbot-page admin-chatbot-rules-page mx-auto max-w-7xl">
      <SEO title={t('seo.title')} noIndex />

      <ChatbotRulesHeader
        saving={saving}
        onReload={handleReload}
        onSave={handleSave}
        onResetDefaults={handleResetDefaults}
        onPreview={handlePreviewPrompt}
        loading={panelLoading}
      />

      <ChatbotRulesStats
        rulesCount={watchedRules.length}
        keywordsCount={watchedKeywords.length}
        promptOverrideEnabled={promptOverrideEnabled}
      />

      <ChatbotRulesContent
        form={form}
        watchedKeywords={watchedKeywords}
        watchedRules={watchedRules}
        keywordInput={keywordInput}
        ruleInput={ruleInput}
        onKeywordInputChange={handleKeywordInputChange}
        onRuleInputChange={handleRuleInputChange}
        onAddKeyword={handleAddKeyword}
        onRemoveKeyword={handleRemoveKeyword}
        onAddRule={handleAddRule}
        onRemoveRule={handleRemoveRule}
        promptOverrideEnabled={promptOverrideEnabled}
        previewOpen={previewOpen}
        previewPrompt={previewPrompt}
        onClosePreview={handleClosePreview}
        testMessage={testMessage}
        testResult={testResult}
        history={history}
        limits={limits}
        panelLoading={panelLoading}
        onTestMessageChange={handleTestMessageChange}
        onTestRules={handleTestRules}
        onRollback={handleRollback}
      />
    </div>
  )
}
