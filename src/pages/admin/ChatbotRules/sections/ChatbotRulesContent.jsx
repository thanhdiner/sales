import { Alert, Badge, Card, Col, Divider, Drawer, Form, Input, List, Row, Select, Space, Tag, Typography, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import ChatbotRulesStringListEditor from '../components/ChatbotRulesStringListEditor'

const { TextArea } = Input
const { Text, Paragraph } = Typography

export default function ChatbotRulesContent({
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
  onRemoveRule,
  promptOverrideEnabled,
  previewOpen,
  previewPrompt,
  onClosePreview,
  testMessage,
  testResult,
  history,
  limits,
  panelLoading,
  onTestMessageChange,
  onTestRules,
  onRollback
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

      {promptOverrideEnabled && (
        <Alert
          className="mb-4"
          type="warning"
          showIcon
          message={t('override.warningTitle')}
          description={t('override.warningDescription')}
        />
      )}

      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={15}>
            <Card title={t('content.identityTitle')} className="admin-chatbot-card mb-4">
              <Form.Item
                name="brandVoice"
                label={t('form.brandVoice')}
                extra={t('form.brandVoiceExtra')}
                rules={[{ max: limits.brandVoice, message: t('validation.max', { count: limits.brandVoice }) }]}
              >
                <TextArea rows={4} maxLength={limits.brandVoice} showCount placeholder={t('form.brandVoicePlaceholder')} />
              </Form.Item>

              <Form.Item
                name="fallbackMessage"
                label={t('form.fallbackMessage')}
                extra={t('form.fallbackMessageExtra')}
                rules={[{ max: limits.fallbackMessage, message: t('validation.max', { count: limits.fallbackMessage }) }]}
              >
                <TextArea rows={2} maxLength={limits.fallbackMessage} showCount placeholder={t('form.fallbackMessagePlaceholder')} />
              </Form.Item>
            </Card>

            <Card
              title={(
                <Space>
                  {t('content.overrideTitle')}
                  {promptOverrideEnabled && <Badge status="warning" text={t('override.active')} />}
                </Space>
              )}
              className="admin-chatbot-card mb-4"
            >
              <Form.Item
                name="systemPromptOverride"
                label={t('form.systemPromptOverride')}
                extra={t('form.systemPromptOverrideExtra')}
                rules={[{ max: limits.systemPromptOverride, message: t('validation.max', { count: limits.systemPromptOverride }) }]}
              >
                <TextArea rows={6} maxLength={limits.systemPromptOverride} showCount placeholder={t('form.systemPromptOverridePlaceholder')} />
              </Form.Item>
            </Card>

            <Card title={t('content.rulesTitle')} className="admin-chatbot-card">
              <Form.Item name="systemRules" hidden>
                <Select mode="multiple" />
              </Form.Item>

              <div className="mb-4">
                <ChatbotRulesStringListEditor
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
                  maxLength={limits.rule}
                />
              </div>

              <Form.Item name="autoEscalateKeywords" hidden>
                <Select mode="multiple" />
              </Form.Item>

              <ChatbotRulesStringListEditor
                title={t('form.autoEscalateKeywords')}
                items={watchedKeywords}
                tagColor="orange"
                inputValue={keywordInput}
                onInputChange={onKeywordInputChange}
                onAdd={onAddKeyword}
                onRemove={onRemoveKeyword}
                placeholder={t('form.autoEscalateKeywordsPlaceholder')}
                buttonLabel={t('form.add')}
                maxLength={limits.keyword}
              />
            </Card>
          </Col>

          <Col xs={24} lg={9}>
            <Card title={t('test.title')} className="admin-chatbot-card mb-4">
              <Space direction="vertical" className="w-full">
                <TextArea rows={3} value={testMessage} onChange={event => onTestMessageChange(event.target.value)} placeholder={t('test.placeholder')} />
                <Button type="primary" loading={panelLoading} onClick={onTestRules}>{t('test.button')}</Button>
                {testResult && (
                  <div className="rounded-lg border p-3">
                    <Paragraph>{testResult.response || testResult.message || testResult.error}</Paragraph>
                    <Space wrap>
                      {testResult.provider && <Tag>{testResult.provider}</Tag>}
                      {testResult.model && <Tag>{testResult.model}</Tag>}
                    </Space>
                  </div>
                )}
              </Space>
            </Card>

            <Card title={t('history.title')} className="admin-chatbot-card">
              <List
                size="small"
                dataSource={history}
                locale={{ emptyText: t('history.empty') }}
                renderItem={item => (
                  <List.Item actions={[<Button key="rollback" size="small" onClick={() => onRollback(item.id)}>{t('history.rollback')}</Button>]}>
                    <List.Item.Meta
                      title={<Text>{new Date(item.createdAt).toLocaleString('vi-VN')}</Text>}
                      description={(
                        <Space wrap>
                          {(item.changedFields || []).map(field => <Tag key={field}>{field}</Tag>)}
                        </Space>
                      )}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Form>

      <Drawer title={t('preview.title')} open={previewOpen} onClose={onClosePreview} width={720}>
        <pre className="whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-sm text-slate-100">{previewPrompt}</pre>
        <Divider />
        <Text type="secondary">{t('preview.note')}</Text>
      </Drawer>
    </>
  )
}
