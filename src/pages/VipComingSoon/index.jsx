import titles from '@/utils/titles'
import { Crown, Clock } from 'lucide-react'

export default function VipComingSoon() {
  titles('Nâng cấp & VIP')

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-yellow-100 px-4 dark:from-gray-800 dark:to-gray-800 rounded-xl">
      <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center max-w-md w-full dark:bg-gray-800 dark:border-gray-600 dark:border-2 dark:border-solid">
        <Crown className="w-14 h-14 text-yellow-500 mb-3" aria-hidden="true" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Nâng cấp & VIP</h1>
        <p className="text-gray-600 mb-4 text-center dark:text-gray-400">
          Tính năng VIP/Nâng cấp tài khoản sẽ mang lại nhiều ưu đãi, quyền lợi đặc biệt cho thành viên.
          <br />
          Chúng tôi đang hoàn thiện để ra mắt trong thời gian tới!
        </p>
        <div className="flex items-center gap-2 text-yellow-600 text-sm">
          <Clock className="w-4 h-4" aria-hidden="true" />
          Chức năng này sẽ sớm xuất hiện!
        </div>
      </div>
    </div>
  )
}
