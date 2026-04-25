import { Clock, UserCheck } from 'lucide-react'

import StatusBadge from './StatusBadge'
import { dayjs } from '../utils'

function getSessionLabel(sessionId) {
  if (!sessionId) {
    return 'Phiên mới'
  }

  return `#${sessionId.slice(-6).toUpperCase()}`
}

export default function ConversationItem({ conversation, isSelected, onSelect }) {
  const customerName = conversation.customer?.name || 'Khách ẩn danh'
  const initials = customerName.charAt(0).toUpperCase()
  const unreadCount = conversation.unreadByAgent || 0
  const isUnassigned = conversation.status === 'unassigned'
  const lastMessagePrefix = conversation.lastMessageSender === 'agent' ? 'Bạn: ' : ''

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full px-4 py-3.5 text-left transition-colors ${
        isSelected
          ? 'bg-[var(--admin-surface-2)]'
          : 'bg-transparent hover:bg-[var(--admin-surface-2)]'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold ${
              isUnassigned
                ? 'border border-[color-mix(in_srgb,#f59e0b_30%,var(--admin-border))] bg-[color-mix(in_srgb,#f59e0b_14%,var(--admin-surface-2))] text-[#b45309] dark:text-[#fbbf24]'
                : 'bg-[var(--admin-surface-2)] text-[var(--admin-text)]'
            }`}
          >
            {initials}
          </div>

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white ring-2 ring-[var(--admin-surface)]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span
              className={`truncate text-sm ${
                unreadCount > 0
                  ? 'font-semibold text-[var(--admin-text)]'
                  : 'font-medium text-[var(--admin-text)]'
              }`}
            >
              {customerName}
            </span>

            <span className="shrink-0 text-[11px] text-[var(--admin-text-subtle)]">
              {dayjs(conversation.lastMessageAt || conversation.createdAt).fromNow()}
            </span>
          </div>

          <p
            className={`truncate text-xs ${
              unreadCount > 0 ? 'font-medium text-[var(--admin-text-muted)]' : 'text-[var(--admin-text-muted)]'
            }`}
          >
            {lastMessagePrefix}
            {conversation.lastMessage || 'Chưa có tin nhắn'}
          </p>

          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <StatusBadge status={conversation.status} compact />
            </div>

            <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--admin-text-subtle)]">
              <Clock className="h-3 w-3" strokeWidth={1.8} />
              {getSessionLabel(conversation.sessionId)}
            </span>
          </div>

          {conversation.assignedAgent?.agentName && (
            <p className="mt-2 flex items-center gap-1 truncate text-[11px] font-medium text-[var(--admin-text-muted)]">
              <UserCheck className="h-3 w-3" strokeWidth={1.8} />
              {conversation.assignedAgent.agentName}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}
