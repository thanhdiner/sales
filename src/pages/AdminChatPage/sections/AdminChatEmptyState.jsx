import { MessageCircle } from 'lucide-react'

export default function AdminChatEmptyState() {
  return (
    <div className="hidden flex-1 items-center justify-center bg-gray-50 dark:bg-gray-950 md:flex">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
          <MessageCircle className="h-10 w-10 text-blue-300" />
        </div>
        <h3 className="mb-1 text-base font-bold text-gray-600 dark:text-gray-300">Chọn cuộc trò chuyện</h3>
        <p className="text-sm text-gray-400">Chọn một cuộc hội thoại từ danh sách để bắt đầu</p>
      </div>
    </div>
  )
}
