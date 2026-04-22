import { CheckCircle, Inbox, MessageCircle, RefreshCw, Search, UserCheck } from 'lucide-react'

import ConversationItem from '../components/ConversationItem'

const CHAT_TABS = [
  { key: 'unassigned', label: 'Chờ xử lý', Icon: Inbox },
  { key: 'mine', label: 'Của tôi', Icon: UserCheck },
  { key: 'open', label: 'Tất cả', Icon: MessageCircle },
  { key: 'resolved', label: 'Đã xong', Icon: CheckCircle }
]

export default function AdminChatSidebar({
  activeTab,
  counts,
  filteredConversations,
  searchQuery,
  selectedSession,
  onRefresh,
  onSearchChange,
  onSelectConversation,
  onTabChange,
  showChatPane
}) {
  return (
    <div
      className={`${
        showChatPane ? 'hidden md:flex' : 'flex'
      } absolute z-10 h-full w-full flex-shrink-0 flex-col border-r border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 md:relative md:w-[280px] lg:w-[320px]`}
    >
      <div className="flex-shrink-0 border-b border-gray-100 px-4 py-4 dark:border-gray-800">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 dark:text-white">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            Hộp thư
          </h2>
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-900/20"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-xs text-gray-700 outline-none transition-colors focus:border-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>
      </div>

      <div className="flex flex-shrink-0 border-b border-gray-100 dark:border-gray-800">
        {CHAT_TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange(key)}
            className={`relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
              activeTab === key
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
            {counts[key] > 0 && (
              <span className="absolute right-1 top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white">
                {counts[key] > 99 ? '99+' : counts[key]}
              </span>
            )}
            {activeTab === key && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-blue-500" />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="py-12 text-center">
            <Inbox className="mx-auto mb-2 h-8 w-8 text-gray-200 dark:text-gray-700" />
            <p className="text-xs text-gray-400">Không có cuộc trò chuyện</p>
          </div>
        ) : (
          filteredConversations.map(conversation => (
            <ConversationItem
              key={conversation.sessionId}
              conversation={conversation}
              isSelected={selectedSession === conversation.sessionId}
              onSelect={() => onSelectConversation(conversation)}
            />
          ))
        )}
      </div>
    </div>
  )
}
