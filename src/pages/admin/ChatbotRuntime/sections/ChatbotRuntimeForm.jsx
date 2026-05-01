import { Alert, Button, Form, Input, InputNumber, Select, Slider, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'

export default function ChatbotRuntimeForm({
  form,
  testing,
  testResult,
  selectedProvider,
  currentModels,
  providerOptions,
  onProviderChange,
  onTest
}) {
  const { t } = useTranslation('adminChatbotRuntime')
  const isNineRouter = selectedProvider === '9router'

  return (
    <>
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Form.Item name="aiProvider" label={t('form.provider')}>
            <Select
              options={providerOptions.map(item => ({ value: item.value, label: item.label }))}
              onChange={onProviderChange}
            />
          </Form.Item>

          {isNineRouter ? (
            <Form.Item
              name="model"
              label={t('form.model')}
              extra={t('form.nineRouterExtra')}
            >
              <Input list="ninerouter-models" placeholder={t('form.nineRouterPlaceholder')} />
            </Form.Item>
          ) : (
            <Form.Item name="model" label={t('form.model')}>
              <Select options={currentModels.map(item => ({ value: item, label: item }))} />
            </Form.Item>
          )}
        </div>

        {isNineRouter && (
          <datalist id="ninerouter-models">
            {currentModels.map(item => (
              <option key={item} value={item} />
            ))}
          </datalist>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <Form.Item name="maxTokens" label={t('form.maxTokens')}>
            <InputNumber min={100} max={4000} step={100} className="w-full" />
          </Form.Item>

          <Form.Item
            name="temperature"
            label={(
              <span>
                {t('form.temperature')}{' '}
                <Tooltip title={t('form.temperatureTooltip')}>
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            )}
          >
            <Slider min={0} max={1} step={0.1} />
          </Form.Item>

          <Form.Item name="maxMessagesPerMinute" label={t('form.maxMessagesPerMinute')}>
            <InputNumber min={1} max={60} className="w-full" />
          </Form.Item>

          <Form.Item name="maxMessagesPerSession" label={t('form.maxMessagesPerSession')}>
            <InputNumber min={10} max={500} className="w-full" />
          </Form.Item>
        </div>
      </Form>

      <Button icon={<ThunderboltOutlined />} onClick={onTest} loading={testing} className="admin-chatbot-action-btn">
        {t('form.testConnection')}
      </Button>

      {testResult && (
        <Alert
          className="admin-chatbot-alert mt-4"
          type={testResult.success ? 'success' : 'error'}
          showIcon
          closable
          icon={testResult.success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          message={testResult.success ? t('test.success') : t('test.failed')}
          description={(
            testResult.success ? (
              <div>
                <p>
                  <strong>{t('test.provider')}:</strong> {testResult.data?.provider}
                </p>
                <p>
                  <strong>{t('test.model')}:</strong> {testResult.data?.model}
                </p>
                <p className="mt-2">
                  <strong>{t('test.botResponse')}:</strong>
                </p>
                <div className="admin-chatbot-runtime-response mt-1 rounded-lg p-3 text-sm">
                  {testResult.data?.response}
                </div>
              </div>
            ) : (
              <span>{testResult.message}</span>
            )
          )}
        />
      )}
    </>
  )
}
