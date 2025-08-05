import titles from '@/utils/titles'
import { Mail, Phone, UserPlus } from 'lucide-react'

titles('Liên hệ hợp tác')

const CooperationContactPage = () => (
  <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
    <div className="max-w-xl w-full bg-white rounded-2xl shadow-md p-8">
      <div className="flex items-center gap-3 mb-3">
        <UserPlus className="text-blue-600 w-7 h-7" />
        <h1 className="text-2xl font-bold text-gray-900">Liên hệ hợp tác</h1>
      </div>
      <p className="text-gray-600 mb-6">
        Bạn muốn hợp tác kinh doanh, quảng cáo, phân phối sản phẩm hoặc trở thành đại lý? Chúng tôi luôn sẵn sàng lắng nghe mọi đề xuất hợp
        tác và cùng phát triển!
      </p>
      <div className="space-y-3 text-base">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-500" />
          <span>
            Email:{' '}
            <a href="mailto:lunashop.business.official@gmail.com" className="text-blue-600 hover:underline">
              lunashop.business.official@gmail.com
            </a>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-green-500" />
          <span>
            Hotline/Zalo:{' '}
            <a href="tel:0823387108" className="text-blue-600 hover:underline">
              0823 387 108
            </a>
          </span>
        </div>
      </div>
      <div className="mt-8 text-gray-500 text-sm text-center">
        <span>Hoặc gửi đề xuất hợp tác về email để được phản hồi trong vòng 24-48h.</span>
      </div>
    </div>
  </div>
)

export default CooperationContactPage
