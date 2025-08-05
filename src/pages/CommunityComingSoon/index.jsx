import titles from '@/utils/titles'
import { Users, Clock } from 'lucide-react'

export default function CommunityComingSoon() {
  titles('Cộng đồng game thủ')

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-100 px-4">
      <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center max-w-md w-full">
        <Users className="w-14 h-14 text-purple-500 mb-3" aria-hidden="true" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Cộng đồng game thủ</h1>
        <p className="text-gray-600 mb-4 text-center">
          Khu vực giao lưu, chia sẻ kinh nghiệm và kết nối các game thủ sẽ sớm được mở cửa.
          <br />
          Đừng bỏ lỡ cơ hội trở thành thành viên đầu tiên của cộng đồng chúng tôi!
        </p>
        <div className="flex items-center gap-2 text-purple-600 text-sm">
          <Clock className="w-4 h-4" aria-hidden="true" />
          Tính năng này đang được phát triển!
        </div>
      </div>
    </div>
  )
}
