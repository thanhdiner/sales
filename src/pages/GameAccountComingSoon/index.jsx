import React from 'react'
import { Gamepad2, Clock } from 'lucide-react'
import titles from '@/utils/titles'

export default function GameAccountComingSoon() {
  titles('Tài khoản game')

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center max-w-md w-full">
        <Gamepad2 className="w-14 h-14 text-blue-500 mb-3" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Tài khoản game</h1>
        <p className="text-gray-600 mb-4 text-center">
          Hiện tại chúng tôi chưa mở bán tài khoản game.
          <br />
          Vui lòng quay lại sau, hoặc liên hệ nếu bạn có nhu cầu riêng!
        </p>
        <div className="flex items-center gap-2 text-blue-600 text-sm">
          <Clock className="w-4 h-4" />
          Dịch vụ sẽ ra mắt trong thời gian tới!
        </div>
      </div>
    </div>
  )
}
