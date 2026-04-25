import { Alert, Badge, Tag, Tooltip, Typography } from 'antd'

const { Text } = Typography

export default function AdminChatbotRuntimeStatusSection({ config }) {
  return (
    <>
      <div className="mb-4 flex flex-wrap gap-3">
        <Tooltip title="Đặt trong file .env: OPENAI_API_KEY">
          <Badge
            status={config?.hasOpenaiKey ? 'success' : 'error'}
            text={(
              <span>
                OpenAI{' '}
                {config?.hasOpenaiKey ? (
                  <Tag color="green">Đã cấu hình</Tag>
                ) : (
                  <Tag color="red">Chưa có</Tag>
                )}
              </span>
            )}
          />
        </Tooltip>

        <Tooltip title="Đặt trong file .env: DEEPSEEK_API_KEY">
          <Badge
            status={config?.hasDeepseekKey ? 'success' : 'error'}
            text={(
              <span>
                DeepSeek{' '}
                {config?.hasDeepseekKey ? (
                  <Tag color="green">Đã cấu hình</Tag>
                ) : (
                  <Tag color="red">Chưa có</Tag>
                )}
              </span>
            )}
          />
        </Tooltip>

        <Tooltip title="Đặt trong file .env: GROQ_API_KEY">
          <Badge
            status={config?.hasGroqKey ? 'success' : 'error'}
            text={(
              <span>
                Groq{' '}
                {config?.hasGroqKey ? (
                  <Tag color="green">Đã cấu hình</Tag>
                ) : (
                  <Tag color="red">Chưa có</Tag>
                )}
              </span>
            )}
          />
        </Tooltip>

        <Tooltip title="Đặt trong file .env: NINEROUTER_API_KEY">
          <Badge
            status={config?.has9routerKey ? 'success' : 'error'}
            text={(
              <span>
                9Router{' '}
                {config?.has9routerKey ? (
                  <Tag color="green">Đã cấu hình</Tag>
                ) : (
                  <Tag color="red">Chưa có</Tag>
                )}
              </span>
            )}
          />
        </Tooltip>
      </div>

      <Alert
        className="admin-chatbot-alert mb-4"
        type="warning"
        showIcon
        message="Runtime thực tế vẫn ưu tiên đọc provider/model từ server"
        description="Admin page lưu cấu hình trong database để orchestrator dùng và để quản trị dễ hơn. API key vẫn phải đặt ở file .env."
      />

      <div className="admin-chatbot-runtime-summary mb-4 rounded-2xl p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Tag color={config?.runtimeEnabled ? 'green' : 'red'}>
            Runtime: {config?.runtimeEnabled ? 'Bật' : 'Tắt'}
          </Tag>
          <Tag color="blue">Provider: {config?.runtimeProvider || '--'}</Tag>
          <Tag color="geekblue">Model: {config?.runtimeModel || '--'}</Tag>
          <Tag color={config?.runtimeBaseUrl ? 'cyan' : 'default'}>
            Base URL: {config?.runtimeBaseUrl || 'Mặc định'}
          </Tag>
        </div>

        <Text>
          Agent runtime hiện dùng provider <strong>{config?.runtimeProvider || '--'}</strong>{' '}
          với model <strong>{config?.runtimeModel || '--'}</strong>.
        </Text>
      </div>

      {config?.runtimeConfigError && (
        <Alert
          className="admin-chatbot-alert mb-4"
          type="error"
          showIcon
          message="Runtime env chưa hợp lệ"
          description={config.runtimeConfigError}
        />
      )}
    </>
  )
}
