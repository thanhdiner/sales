import titles from '@/utils/titles'
import { ShieldCheck, Clock } from 'lucide-react'

export default function LicenseComingSoon() {
  titles('Bản quyền phần mềm')

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 dark:from-gray-800 dark:to-gray-800 rounded-xl">
      <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center max-w-md w-full dark:bg-gray-800 dark:border-gray-600 dark:border-solid dark:border-2">
        <ShieldCheck className="w-14 h-14 text-blue-500 mb-3" aria-hidden="true" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Bản quyền phần mềm</h1>
        <p className="text-gray-600 mb-4 text-center dark:text-gray-400">
          Chuyên mục cung cấp phần mềm bản quyền, key chính hãng, cam kết nguồn gốc rõ ràng sẽ được cập nhật trong thời gian tới.
          <br />
          Hãy theo dõi để không bỏ lỡ các ưu đãi độc quyền!
        </p>
        <div className="flex items-center gap-2 text-blue-600 text-sm">
          <Clock className="w-4 h-4" aria-hidden="true" />
          Tính năng này đang trong quá trình phát triển!
        </div>
      </div>
    </div>
  )
}
