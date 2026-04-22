import { CheckCircle, Clock, Globe, MessageCircle, UserCheck } from 'lucide-react'

import StatusBadge from '../components/StatusBadge'
import { dayjs } from '../utils'

export default function AdminChatDetailsPane({
  isAssignedToMe,
  isResolved,
  messages,
  selectedConversation,
  onAssign,
  onResolve
}) {
  if (!selectedConversation) {
    return null
  }

  return (
    <div className="hidden h-full w-[260px] flex-shrink-0 overflow-y-auto bg-white dark:bg-gray-900 lg:block xl:w-[280px]">
      <div className="border-b border-gray-100 px-5 py-6 text-center dark:border-gray-800">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-xl font-bold text-white">
          {(selectedConversation.customer?.name || 'K')[0].toUpperCase()}
        </div>
        <p className="font-bold text-gray-800 dark:text-white">{selectedConversation.customer?.name || 'Khách ẩn danh'}</p>
        <StatusBadge status={selectedConversation.status} />
      </div>

      <div className="space-y-4 p-4">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Thông tin hội thoại</p>
          <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
              <div>
                <p className="text-[10px] text-gray-400">Bắt đầu</p>
                <p className="text-gray-700 dark:text-gray-300">{dayjs(selectedConversation.createdAt).format('DD/MM HH:mm')}</p>
              </div>
            </div>

            {selectedConversation.firstReplyAt && (
              <div className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400">Phản hồi đầu tiên</p>
                  <p className="text-gray-700 dark:text-gray-300">{dayjs(selectedConversation.firstReplyAt).format('DD/MM HH:mm')}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <MessageCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
              <div>
                <p className="text-[10px] text-gray-400">Số tin nhắn</p>
                <p className="text-gray-700 dark:text-gray-300">{selectedConversation.messageCount || messages.length}</p>
              </div>
            </div>

            {selectedConversation.customer?.currentPage && (
              <div className="flex min-w-0 items-start gap-2">
                <Globe className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-gray-400">Trang hiện tại</p>
                  <p
                    className="line-clamp-2 break-all text-[11px] text-gray-700 dark:text-gray-300"
                    title={selectedConversation.customer.currentPage}
                  >
                    {selectedConversation.customer.currentPage}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Agent phụ trách</p>
          {selectedConversation.assignedAgent?.agentName ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {selectedConversation.assignedAgent.agentName[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{selectedConversation.assignedAgent.agentName}</p>
                <p className="text-[10px] text-gray-400">{dayjs(selectedConversation.assignedAgent.assignedAt).fromNow()}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <UserCheck className="h-4 w-4" />
              <span className="text-xs">Chưa được phân công</span>
            </div>
          )}
        </div>

        {!isResolved && (
          <div className="space-y-2 border-t border-gray-100 pt-4 dark:border-gray-800">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Hành động nhanh</p>
            {selectedConversation.status === 'unassigned' && (
              <button
                type="button"
                onClick={onAssign}
                className="flex w-full items-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-left text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                <UserCheck className="h-3.5 w-3.5" />
                Nhận cuộc trò chuyện
              </button>
            )}
            {isAssignedToMe && (
              <button
                type="button"
                onClick={onResolve}
                className="flex w-full items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-left text-xs font-medium text-green-700 transition-colors hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Đánh dấu đã giải quyết
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
