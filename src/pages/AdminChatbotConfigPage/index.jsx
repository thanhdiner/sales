import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  Form,
  Input,
  Select,
  Switch,
  Slider,
  InputNumber,
  Button,
  Tag,
  Space,
  Alert,
  Spin,
  Typography,
  message,
  Badge,
  Tooltip
} from 'antd'
import {
  RobotOutlined,
  ApiOutlined,
  SaveOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import {
  getChatbotConfig,
  updateChatbotConfig,
  testChatbotConnection
} from '@/services/adminChatbotConfigService'

const { TextArea } = Input
const { Title, Text } = Typography

const PROVIDER_OPTIONS = [
  { value: 'openai', label: 'OpenAI', models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { value: 'deepseek', label: 'DeepSeek', models: ['deepseek-chat', 'deepseek-reasoner'] },
  { value: 'groq', label: 'Groq', models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it', 'mixtral-8x7b-32768'] }
]

const AdminChatbotConfigPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [config, setConfig] = useState(null)
  const [testResult, setTestResult] = useState(null)
  const [selectedProvider, setSelectedProvider] = useState('openai')
  const [keywordInput, setKeywordInput] = useState('')

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getChatbotConfig()
      if (res?.success && res.data) {
        setConfig(res.data)
        setSelectedProvider(res.data.aiProvider || 'openai')
        form.setFieldsValue({
          isEnabled: res.data.isEnabled,
          aiProvider: res.data.aiProvider || 'openai',
          model: res.data.model || 'gpt-4o-mini',
          maxTokens: res.data.maxTokens || 1000,
          temperature: res.data.temperature ?? 0.7,
          brandVoice: res.data.brandVoice || '',
          systemPromptOverride: res.data.systemPromptOverride || '',
          fallbackMessage: res.data.fallbackMessage || '',
          autoEscalateKeywords: res.data.autoEscalateKeywords || [],
          maxMessagesPerMinute: res.data.maxMessagesPerMinute || 10,
          maxMessagesPerSession: res.data.maxMessagesPerSession || 100
        })
      }
    } catch (err) {
      message.error('Không thể tải cấu hình chatbot')
    } finally {
      setLoading(false)
    }
  }, [form])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  const handleSave = async () => {
    try {
      setSaving(true)
      const values = form.getFieldsValue()
      const res = await updateChatbotConfig(values)
      if (res?.success) {
        message.success(res.message || 'Cập nhật thành công!')
        loadConfig()
      } else {
        message.error(res?.message || 'Cập nhật thất bại')
      }
    } catch (err) {
      message.error('Có lỗi xảy ra khi cập nhật')
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    try {
      setTesting(true)
      setTestResult(null)
      const res = await testChatbotConnection()
      setTestResult(res)
      if (res?.success) {
        message.success('Kết nối thành công!')
      } else {
        message.error(res?.message || 'Kết nối thất bại')
      }
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Lỗi kết nối' })
      message.error('Lỗi kết nối: ' + (err.response?.message || err.message))
    } finally {
      setTesting(false)
    }
  }

  const handleProviderChange = (value) => {
    setSelectedProvider(value)
    const provider = PROVIDER_OPTIONS.find(p => p.value === value)
    if (provider) {
      form.setFieldsValue({ model: provider.models[0] })
    }
  }

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return
    const current = form.getFieldValue('autoEscalateKeywords') || []
    if (!current.includes(keywordInput.trim())) {
      form.setFieldsValue({ autoEscalateKeywords: [...current, keywordInput.trim()] })
    }
    setKeywordInput('')
  }

  const handleRemoveKeyword = (keyword) => {
    const current = form.getFieldValue('autoEscalateKeywords') || []
    form.setFieldsValue({ autoEscalateKeywords: current.filter(k => k !== keyword) })
  }

  const currentModels = PROVIDER_OPTIONS.find(p => p.value === selectedProvider)?.models || []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <RobotOutlined style={{ fontSize: 20, color: '#fff' }} />
          </div>
          <div>
            <Title level={4} className="!mb-0 dark:text-white">Cấu hình AI Chatbot</Title>
            <Text type="secondary" className="dark:text-gray-400">Quản lý provider, model và hành vi bot</Text>
          </div>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadConfig}>
            Tải lại
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
            className="bg-blue-600"
          >
            Lưu cấu hình
          </Button>
        </Space>
      </div>

      <Form form={form} layout="vertical" className="space-y-0">

        {/* ── API Connection ───────────────────────────────────────── */}
        <Card
          title={
            <span className="flex items-center gap-2">
              <ApiOutlined /> Kết nối API
            </span>
          }
          className="mb-4 dark:bg-gray-800 dark:border-gray-700"
        >
          {/* Key status badges */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Tooltip title="Đặt trong file .env: OPENAI_API_KEY">
              <Badge
                status={config?.hasOpenaiKey ? 'success' : 'error'}
                text={
                  <span className="dark:text-gray-300">
                    OpenAI Key: {config?.hasOpenaiKey
                      ? <Tag color="green">Đã cấu hình</Tag>
                      : <Tag color="red">Chưa có</Tag>
                    }
                  </span>
                }
              />
            </Tooltip>
            <Tooltip title="Đặt trong file .env: DEEPSEEK_API_KEY">
              <Badge
                status={config?.hasDeepseekKey ? 'success' : 'error'}
                text={
                  <span className="dark:text-gray-300">
                    DeepSeek Key: {config?.hasDeepseekKey
                      ? <Tag color="green">Đã cấu hình</Tag>
                      : <Tag color="red">Chưa có</Tag>
                    }
                  </span>
                }
              />
            </Tooltip>
            <Tooltip title="Đặt trong file .env: GROQ_API_KEY">
              <Badge
                status={config?.hasGroqKey ? 'success' : 'error'}
                text={
                  <span className="dark:text-gray-300">
                    Groq Key: {config?.hasGroqKey
                      ? <Tag color="green">Đã cấu hình</Tag>
                      : <Tag color="red">Chưa có</Tag>
                    }
                  </span>
                }
              />
            </Tooltip>
          </div>

          <Alert
            message="API Key được cấu hình trong file .env trên server"
            description="Vì lý do bảo mật, API Key không lưu trong database. Bạn cần SSH vào server và sửa file .env để thêm/đổi API key."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            className="mb-4"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="aiProvider" label="AI Provider">
              <Select
                options={PROVIDER_OPTIONS.map(p => ({ value: p.value, label: p.label }))}
                onChange={handleProviderChange}
              />
            </Form.Item>

            <Form.Item name="model" label="Model">
              <Select
                options={currentModels.map(m => ({ value: m, label: m }))}
              />
            </Form.Item>
          </div>

          {/* Test connection */}
          <Button
            icon={<ThunderboltOutlined />}
            onClick={handleTest}
            loading={testing}
            className="mb-3"
          >
            Test kết nối
          </Button>

          {testResult && (
            <Alert
              message={testResult.success ? 'Kết nối thành công!' : 'Kết nối thất bại'}
              description={
                testResult.success ? (
                  <div>
                    <p><strong>Provider:</strong> {testResult.data?.provider}</p>
                    <p><strong>Model:</strong> {testResult.data?.model}</p>
                    <p className="mt-2"><strong>Bot trả lời:</strong></p>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mt-1 text-sm">
                      {testResult.data?.response}
                    </div>
                  </div>
                ) : (
                  <span>{testResult.message}</span>
                )
              }
              type={testResult.success ? 'success' : 'error'}
              showIcon
              icon={testResult.success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              closable
              className="mt-2"
            />
          )}
        </Card>

        {/* ── General Settings ─────────────────────────────────────── */}
        <Card
          title={
            <span className="flex items-center gap-2">
              <RobotOutlined /> Cài đặt chung
            </span>
          }
          className="mb-4 dark:bg-gray-800 dark:border-gray-700"
        >
          <Form.Item name="isEnabled" label="Bật Chatbot" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item name="maxTokens" label="Max Tokens/Response">
              <InputNumber min={100} max={4000} step={100} className="w-full" />
            </Form.Item>

            <Form.Item name="temperature" label={
              <span>
                Temperature{' '}
                <Tooltip title="0 = chính xác, 1 = sáng tạo"><InfoCircleOutlined /></Tooltip>
              </span>
            }>
              <Slider min={0} max={1} step={0.1} />
            </Form.Item>

            <div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="maxMessagesPerMinute" label="Max messages/phút (rate limit)">
              <InputNumber min={1} max={60} className="w-full" />
            </Form.Item>

            <Form.Item name="maxMessagesPerSession" label="Max messages/phiên">
              <InputNumber min={10} max={500} className="w-full" />
            </Form.Item>
          </div>
        </Card>

        {/* ── Brand Voice & Prompt ─────────────────────────────────── */}
        <Card
          title="Giọng thương hiệu & Prompt"
          className="mb-4 dark:bg-gray-800 dark:border-gray-700"
        >
          <Form.Item
            name="brandVoice"
            label="Hướng dẫn giọng thương hiệu"
            extra="Mô tả cách bot nên giao tiếp (giọng điệu, xưng hô, phong cách)"
          >
            <TextArea
              rows={4}
              placeholder="Ví dụ: Thân thiện, xưng 'mình' và 'bạn', dùng emoji vừa phải..."
            />
          </Form.Item>

          <Form.Item
            name="systemPromptOverride"
            label="Override System Prompt"
            extra="Nếu điền, sẽ thay thế hoàn toàn system prompt mặc định. Để trống để dùng prompt mặc định."
          >
            <TextArea
              rows={6}
              placeholder="Để trống để dùng system prompt mặc định..."
            />
          </Form.Item>

          <Form.Item
            name="fallbackMessage"
            label="Tin nhắn Fallback"
            extra="Gửi khi bot gặp lỗi hoặc không trả lời được"
          >
            <TextArea
              rows={2}
              placeholder="Xin lỗi, mình gặp chút trục trặc..."
            />
          </Form.Item>
        </Card>

        {/* ── Escalation Keywords ──────────────────────────────────── */}
        <Card
          title="Từ khóa chuyển nhân viên (Auto-Escalate)"
          className="mb-4 dark:bg-gray-800 dark:border-gray-700"
          extra={
            <Text type="secondary" className="text-xs dark:text-gray-400">
              Khi khách nhắn chứa từ khóa này → bot tự chuyển nhân viên
            </Text>
          }
        >
          <Form.Item name="autoEscalateKeywords" hidden><Input /></Form.Item>

          <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
            {(form.getFieldValue('autoEscalateKeywords') || []).map((kw, i) => (
              <Tag
                key={i}
                closable
                onClose={() => handleRemoveKeyword(kw)}
                color="orange"
                className="text-sm py-0.5"
              >
                {kw}
              </Tag>
            ))}
          </div>

          <Space.Compact className="w-full max-w-md">
            <Input
              value={keywordInput}
              onChange={e => setKeywordInput(e.target.value)}
              onPressEnter={handleAddKeyword}
              placeholder="Nhập từ khóa và Enter..."
            />
            <Button onClick={handleAddKeyword} type="primary" className="bg-blue-600">
              Thêm
            </Button>
          </Space.Compact>
        </Card>

      </Form>
    </div>
  )
}

export default AdminChatbotConfigPage
