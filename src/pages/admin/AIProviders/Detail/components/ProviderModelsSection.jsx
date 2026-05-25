import { Button, Card, Empty, Popconfirm, Tooltip, Typography, message } from 'antd'
import { CloseOutlined, CopyOutlined, ExperimentOutlined, PlusOutlined, RobotOutlined } from '@ant-design/icons'
import { getProviderModels } from '../hooks/useAIProviderDetail'

const { Text } = Typography

async function copyModelId(model) {
  try {
    await navigator.clipboard.writeText(model)
    message.success('Copied model ID')
  } catch {
    message.error('Cannot copy model ID')
  }
}

function ProviderModelItem({ model, defaultModel, testingModel, onTestModel, onDeleteModel }) {
  const isDefault = model.model === defaultModel

  return (
    <div className="admin-ai-provider-model-item group">
      <RobotOutlined className="admin-ai-provider-model-item__icon" />

      <div className="min-w-0 flex-1">
        <Text code className="max-w-full truncate">{model.model}</Text>
        {isDefault && <Text className="ml-2 text-xs" type="secondary">default</Text>}
      </div>

      <div className="admin-ai-provider-model-item__actions">
        <Tooltip title="Test model">
          <Button
            type="text"
            icon={<ExperimentOutlined />}
            loading={testingModel === model.model}
            onClick={() => onTestModel(model.model)}
          />
        </Tooltip>

        <Tooltip title="Copy model ID">
          <Button type="text" icon={<CopyOutlined />} onClick={() => copyModelId(model.model)} />
        </Tooltip>

        <Popconfirm
          title="Delete model?"
          okText="Delete"
          okButtonProps={{ danger: true }}
          onConfirm={() => onDeleteModel(model.model)}
        >
          <Tooltip title="Delete model">
            <Button type="text" danger icon={<CloseOutlined />} />
          </Tooltip>
        </Popconfirm>
      </div>
    </div>
  )
}

export default function ProviderModelsSection({ provider, testingModel, onAddModel, onTestModel, onDeleteModel }) {
  const models = getProviderModels(provider)

  return (
    <Card
      className="admin-chatbot-card"
      title="Available Models"
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={onAddModel}>Add Model</Button>}
    >
      {models.length === 0 ? (
        <Empty description="No models configured" />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {models.map(model => (
            <ProviderModelItem
              key={model.model}
              model={model}
              defaultModel={provider?.defaultModel}
              testingModel={testingModel}
              onTestModel={onTestModel}
              onDeleteModel={onDeleteModel}
            />
          ))}
        </div>
      )}
    </Card>
  )
}
