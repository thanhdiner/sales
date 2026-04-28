import { Card, Form, Input, Switch } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const { TextArea } = Input

export default function AdminChatbotConfigFormSection({ form }) {
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
    </Form>
  )
}
