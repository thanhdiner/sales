import { Newspaper, Clock } from 'lucide-react'
import titles from '@/utils/titles'

export default function GameNewsComingSoon() {
  titles('Tin tức game')

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center max-w-md w-full">
        <Newspaper className="w-14 h-14 text-indigo-500 mb-3" aria-hidden="true" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Tin tức game</h1>
        <p className="text-gray-600 mb-4 text-center">
          Mục tin tức game sẽ cập nhật các sự kiện, khuyến mãi và thông tin mới nhất trong thời gian tới.
          <br />
          Đừng quên quay lại để không bỏ lỡ bất kỳ tin nóng nào!
        </p>
        <div className="flex items-center gap-2 text-indigo-600 text-sm">
          <Clock className="w-4 h-4" aria-hidden="true" />
          Chức năng này sẽ sớm ra mắt!
        </div>
      </div>
    </div>
  )
}
