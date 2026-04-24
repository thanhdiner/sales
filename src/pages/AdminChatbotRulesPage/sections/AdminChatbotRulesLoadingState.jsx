import { Spin } from 'antd'

export default function AdminChatbotRulesLoadingState() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Spin size="large" />
    </div>
  )
}
