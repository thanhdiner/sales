import { Alert, Card, Form, Input, Select, Switch } from 'antd'
import { ApiOutlined, RobotOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const { TextArea } = Input

export default function ChatbotConfigForm({
  form,
  providerOptions = [],
  modelOptions = [],
  fallbackProviderOptions = [],
  fallbackModelOptions = [],
  toolsModelWarning = false
}) {
  const { t } = useTranslation('adminChatbotConfig')

  return (
    <Form form={form} layout="vertical">
      <Card
        title={(
          <span className="flex items-center gap-2">
            <RobotOutlined /> {t('form.profileTitle')}
          </span>
        )}
        className="admin-chatbot-card"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Form.Item name="agentName" label={t('form.agentName')}>
            <Input placeholder={t('form.agentNamePlaceholder')} />
          </Form.Item>

          <Form.Item name="agentTone" label={t('form.agentTone')}>
            <Input placeholder={t('form.agentTonePlaceholder')} />
          </Form.Item>

          <Form.Item name="isEnabled" label={t('form.isEnabled')} valuePropName="checked">
            <Switch checkedChildren={t('form.enabled')} unCheckedChildren={t('form.disabled')} />
          </Form.Item>
        </div>

        <Form.Item
          name="agentRole"
          label={t('form.agentRole')}
          extra={t('form.agentRoleExtra')}
        >
          <TextArea rows={3} placeholder={t('form.agentRolePlaceholder')} />
        </Form.Item>
      </Card>

      <Card
        title={(
          <span className="flex items-center gap-2">
            <ApiOutlined /> Agent model
          </span>
        )}
        className="admin-chatbot-card mt-4"
      >
        {toolsModelWarning && (
          <Alert
            className="mb-4"
            type="warning"
            showIcon
            message="This agent has enabled tools, but the selected model is marked as not supporting tools."
          />
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Form.Item name="providerKey" label="Provider" rules={[{ required: true }]}>
            <Select options={providerOptions} showSearch optionFilterProp="label" placeholder="Select enabled provider" />
          </Form.Item>

          <Form.Item name="model" label="Model" rules={[{ required: true }]}>
            <Select options={modelOptions} showSearch optionFilterProp="label" placeholder="Select enabled model" />
          </Form.Item>

          <Form.Item name="fallbackProvider" label="Fallback provider">
            <Select allowClear options={fallbackProviderOptions} showSearch optionFilterProp="label" placeholder="Optional fallback provider" />
          </Form.Item>

          <Form.Item name="fallbackModel" label="Fallback model">
            <Select allowClear options={fallbackModelOptions} showSearch optionFilterProp="label" placeholder="Optional fallback model" disabled={!fallbackModelOptions.length} />
          </Form.Item>
        </div>
      </Card>
    </Form>
  )
}
