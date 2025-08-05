import titles from '@/utils/titles'
import { Sparkles, Clock } from 'lucide-react'

export default function SpecialPackageComingSoon() {
  titles('Gói dịch vụ đặc biệt')

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center max-w-md w-full">
        <Sparkles className="w-14 h-14 text-purple-500 mb-3" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Gói dịch vụ đặc biệt</h1>
        <p className="text-gray-600 mb-4 text-center">
          Hiện tại chúng tôi chưa cung cấp các gói dịch vụ đặc biệt.
          <br />
          Hãy quay lại sau hoặc liên hệ với chúng tôi để được tư vấn thêm nếu bạn có nhu cầu riêng!
        </p>
        <div className="flex items-center gap-2 text-purple-600 text-sm">
          <Clock className="w-4 h-4" />
          Dịch vụ này sẽ ra mắt trong thời gian tới!
        </div>
      </div>
    </div>
  )
}
