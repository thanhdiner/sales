import { Alert, Card, Form, Input, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import AdminChatbotRulesStringListEditor from '../components/AdminChatbotRulesStringListEditor'

const { TextArea } = Input

export default function AdminChatbotRulesContentSection({
  form,
  watchedKeywords,
  watchedRules,
  keywordInput,
  ruleInput,
  onKeywordInputChange,
  onRuleInputChange,
  onAddKeyword,
  onRemoveKeyword,
  onAddRule,
  onRemoveRule
}) {
  const { t } = useTranslation('adminChatbotRules')

  return (
    <>
      <Alert
        className="admin-chatbot-alert mb-4"
        type="info"
        showIcon
        message={t('alert.message')}
        description={t('alert.description')}
      />

      <Form form={form} layout="vertical">
        <Card title={t('content.title')} className="admin-chatbot-card">
          <Form.Item
            name="brandVoice"
            label={t('form.brandVoice')}
            extra={t('form.brandVoiceExtra')}
          >
            <TextArea
              rows={4}
              placeholder={t('form.brandVoicePlaceholder')}
            />
          </Form.Item>

          <Form.Item
            name="systemPromptOverride"
            label={t('form.systemPromptOverride')}
            extra={t('form.systemPromptOverrideExtra')}
          >
            <TextArea rows={6} placeholder={t('form.systemPromptOverridePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="fallbackMessage"
            label={t('form.fallbackMessage')}
            extra={t('form.fallbackMessageExtra')}
          >
            <TextArea rows={2} placeholder={t('form.fallbackMessagePlaceholder')} />
          </Form.Item>

          <Form.Item name="systemRules" hidden>
            <Select mode="multiple" />
          </Form.Item>

          <div className="mb-4">
            <AdminChatbotRulesStringListEditor
              title={t('form.systemRules')}
              items={watchedRules}
              tagColor="blue"
              inputValue={ruleInput}
              onInputChange={onRuleInputChange}
              onAdd={onAddRule}
              onRemove={onRemoveRule}
              placeholder={t('form.systemRulesPlaceholder')}
              buttonLabel={t('form.addRule')}
              buttonType="primary"
              compactClassName="max-w-2xl"
            />
          </div>

          <Form.Item name="autoEscalateKeywords" hidden>
            <Select mode="multiple" />
          </Form.Item>

          <AdminChatbotRulesStringListEditor
            title={t('form.autoEscalateKeywords')}
            items={watchedKeywords}
            tagColor="orange"
            inputValue={keywordInput}
            onInputChange={onKeywordInputChange}
            onAdd={onAddKeyword}
            onRemove={onRemoveKeyword}
            placeholder={t('form.autoEscalateKeywordsPlaceholder')}
            buttonLabel={t('form.add')}
          />
        </Card>
      </Form>
    </>
  )
}
