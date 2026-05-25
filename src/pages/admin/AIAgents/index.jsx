import { Button, Space, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import SEO from '@/components/shared/SEO'
import '@/pages/admin/ChatbotShared/ChatbotTheme.scss'
import '@/pages/admin/AIProviderKeys/components/ProviderKeysList.scss'
import './index.scss'
import AIAgentList from './components/AIAgentList'
import AIAgentModal from './components/AIAgentModal'
import { useAIAgents } from './hooks/useAIAgents'

const { Text, Title } = Typography

export default function AIAgents() {
  const {
    form,
    agents,
    providerOptions,
    toolRegistry,
    loading,
    modalOpen,
    editingAgent,
    saving,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSave,
    handleAvatarBeforeUpload,
    handleAvatarRemove,
    toggleAgent,
    deleteAgent,
    setDefaultAgent,
    moveAgent,
    refresh
  } = useAIAgents()

  return (
    <div className="admin-chatbot-page admin-ai-agents mx-auto max-w-7xl">
      <SEO title="AI Agents" noIndex />

      <div className="mb-5 flex flex-col gap-2">
        <Title level={3} className="!mb-0">AI Agents</Title>
        <Text type="secondary">
          Manage chatbot personas. Each agent has its own model, system prompt, and tool access.
        </Text>
      </div>

      <AIAgentList
        title="Agents"
        agents={agents}
        loading={loading}
        onEdit={openEditModal}
        onDelete={deleteAgent}
        onToggle={toggleAgent}
        onMove={moveAgent}
        onSetDefault={setDefaultAgent}
        extra={(
          <Space>
            <Button icon={<ReloadOutlined />} loading={loading} onClick={refresh} />
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Add agent
            </Button>
          </Space>
        )}
      />

      <AIAgentModal
        form={form}
        open={modalOpen}
        editingAgent={editingAgent}
        saving={saving}
        providerOptions={providerOptions}
        toolRegistry={toolRegistry}
        onOk={handleSave}
        onCancel={closeModal}
        onAvatarBeforeUpload={handleAvatarBeforeUpload}
        onAvatarRemove={handleAvatarRemove}
      />
    </div>
  )
}
