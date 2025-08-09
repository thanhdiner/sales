import titles from '@/utils/titles'
import { Mail, Phone, UserPlus } from 'lucide-react'
import { useSelector } from 'react-redux'

const CooperationContactPage = () => {
  titles('Liên hệ hợp tác')

  const websiteConfig = useSelector(state => state.websiteConfig.data)

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 dark:from-gray-800 dark:to-gray-800 rounded-xl">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-md p-8 dark:bg-gray-800 dark:outline dark:outline-solid dark:outline-1 dark:outline-white">
        <div className="flex items-center gap-3 mb-3">
          <UserPlus className="text-blue-600 w-7 h-7" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Liên hệ hợp tác</h1>
        </div>
        <p className="text-gray-600 mb-6 dark:text-gray-300">
          Bạn muốn hợp tác kinh doanh, quảng cáo, phân phối sản phẩm hoặc trở thành đại lý? Chúng tôi luôn sẵn sàng lắng nghe mọi đề xuất
          hợp tác và cùng phát triển!
        </p>
        <div className="space-y-3 text-base">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            <span className="dark:text-gray-300">
              Email:{' '}
              <a
                href={`mailto:${websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com'}`}
                className="text-blue-600 hover:underline"
              >
                {websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com'}
              </a>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-500" />
            <span className="dark:text-gray-300">
              Hotline/Zalo:{' '}
              <a href={`tel:${websiteConfig?.contactInfo?.phone || '0823387108'}`} className="text-blue-600 hover:underline">
                {websiteConfig?.contactInfo?.phone || '0823387108'}
              </a>
            </span>
          </div>
        </div>
        <div className="mt-8 text-gray-500 text-sm text-center dark:text-gray-400">
          <span>Hoặc gửi đề xuất hợp tác về email để được phản hồi trong vòng 24-48h.</span>
        </div>
      </div>
    </div>
  )
}

export default CooperationContactPage
