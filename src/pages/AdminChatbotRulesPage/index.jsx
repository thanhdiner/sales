import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import useAdminChatbotRulesPage from './hooks/useAdminChatbotRulesPage'
import AdminChatbotRulesContentSection from './sections/AdminChatbotRulesContentSection'
import AdminChatbotRulesHeaderSection from './sections/AdminChatbotRulesHeaderSection'
import AdminChatbotRulesLoadingState from './sections/AdminChatbotRulesLoadingState'
import AdminChatbotRulesStatsSection from './sections/AdminChatbotRulesStatsSection'
import '@/pages/AdminChatbotShared/AdminChatbotTheme.scss'

export default function AdminChatbotRulesPage() {
  const { t } = useTranslation('adminChatbotRules')
  const {
    form,
    loading,
    saving,
    watchedKeywords,
    watchedRules,
    promptOverrideEnabled,
    keywordInput,
    ruleInput,
    handleReload,
    handleSave,
    handleKeywordInputChange,
    handleRuleInputChange,
    handleAddKeyword,
    handleRemoveKeyword,
    handleAddRule,
    handleRemoveRule
  } = useAdminChatbotRulesPage()

  if (loading) {
    return <AdminChatbotRulesLoadingState />
  }

  return (
    <div className="admin-chatbot-page mx-auto max-w-7xl">
      <SEO title={t('seo.title')} noIndex />

      <AdminChatbotRulesHeaderSection
        saving={saving}
        onReload={handleReload}
        onSave={handleSave}
      />

      <AdminChatbotRulesStatsSection
        rulesCount={watchedRules.length}
        keywordsCount={watchedKeywords.length}
        promptOverrideEnabled={promptOverrideEnabled}
      />

      <AdminChatbotRulesContentSection
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
      />
    </div>
  )
}
