import { Alert, Button, Form, Input, InputNumber, Select, Slider, Tooltip } from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'

export default function AdminChatbotRuntimeFormSection({
  form,
  testing,
  testResult,
  selectedProvider,
  currentModels,
  providerOptions,
  onProviderChange,
  onTest
}) {
  const isNineRouter = selectedProvider === '9router'

  return (
    <>
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Form.Item name="aiProvider" label="AI provider">
            <Select
              options={providerOptions.map(item => ({ value: item.value, label: item.label }))}
              onChange={onProviderChange}
            />
          </Form.Item>

          {isNineRouter ? (
            <Form.Item
              name="model"
              label="Model"
              extra="9Router có thể dùng model custom nếu gateway local hỗ trợ."
            >
              <Input list="ninerouter-models" placeholder="Ví dụ: gemini-2.5-flash" />
            </Form.Item>
          ) : (
            <Form.Item name="model" label="Model">
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
          <Form.Item name="maxTokens" label="Max tokens">
            <InputNumber min={100} max={4000} step={100} className="w-full" />
          </Form.Item>

          <Form.Item
            name="temperature"
            label={(
              <span>
                Temperature{' '}
                <Tooltip title="0 = ổn định hơn, 1 = sáng tạo hơn">
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            )}
          >
            <Slider min={0} max={1} step={0.1} />
          </Form.Item>

          <Form.Item name="maxMessagesPerMinute" label="Max messages/phút">
            <InputNumber min={1} max={60} className="w-full" />
          </Form.Item>

          <Form.Item name="maxMessagesPerSession" label="Max messages/phiên">
            <InputNumber min={10} max={500} className="w-full" />
          </Form.Item>
        </div>
      </Form>

      <Button icon={<ThunderboltOutlined />} onClick={onTest} loading={testing} className="admin-chatbot-action-btn">
        Test kết nối
      </Button>

      {testResult && (
        <Alert
          className="admin-chatbot-alert mt-4"
          type={testResult.success ? 'success' : 'error'}
          showIcon
          closable
          icon={testResult.success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          message={testResult.success ? 'Kết nối thành công' : 'Kết nối thất bại'}
          description={(
            testResult.success ? (
              <div>
                <p>
                  <strong>Provider:</strong> {testResult.data?.provider}
                </p>
                <p>
                  <strong>Model:</strong> {testResult.data?.model}
                </p>
                <p className="mt-2">
                  <strong>Bot trả lời:</strong>
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
