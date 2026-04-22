import { dayjs } from '../utils'

export default function ConversationItem({ conversation, isSelected, onSelect }) {
  const customerName = conversation.customer?.name || 'Khách ẩn danh'
  const initials = customerName.charAt(0).toUpperCase()
  const unreadCount = conversation.unreadByAgent || 0
  const isUnassigned = conversation.status === 'unassigned'

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full border-b border-gray-50 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/50 ${
        isSelected
          ? 'border-l-2 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-l-2 border-l-transparent'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${
              isUnassigned ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            }`}
          >
            {initials}
          </div>
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center justify-between gap-1">
            <span
              className={`truncate text-sm ${
                unreadCount > 0 ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'
              }`}
            >
              {customerName}
            </span>
            <span className="flex-shrink-0 text-[10px] text-gray-400">
              {dayjs(conversation.lastMessageAt || conversation.createdAt).fromNow()}
            </span>
          </div>

          <p
            className={`truncate text-xs ${
              unreadCount > 0 ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {conversation.lastMessageSender === 'agent' ? '↩ ' : ''}
            {conversation.lastMessage || 'Chưa có tin nhắn'}
          </p>

          {conversation.assignedAgent?.agentName && (
            <p className="mt-0.5 truncate text-[10px] text-blue-500">● {conversation.assignedAgent.agentName}</p>
          )}
        </div>
      </div>
    </button>
  )
}
