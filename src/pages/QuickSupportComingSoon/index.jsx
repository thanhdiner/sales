import titles from '@/utils/titles'
import { Headphones, Clock } from 'lucide-react'

export default function QuickSupportComingSoon() {
  titles('Hỗ trợ nhanh')

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-teal-100 px-4">
      <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center max-w-md w-full">
        <Headphones className="w-14 h-14 text-teal-500 mb-3" aria-hidden="true" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Hỗ trợ nhanh</h1>
        <p className="text-gray-600 mb-4 text-center">
          Tính năng hỗ trợ khách hàng, giải đáp thắc mắc tức thì sẽ sớm ra mắt.
          <br />
          Hãy yên tâm, đội ngũ của chúng tôi luôn sẵn sàng đồng hành cùng bạn!
        </p>
        <div className="flex items-center gap-2 text-teal-600 text-sm">
          <Clock className="w-4 h-4" aria-hidden="true" />
          Chức năng này sẽ sớm hoạt động!
        </div>
      </div>
    </div>
  )
}
