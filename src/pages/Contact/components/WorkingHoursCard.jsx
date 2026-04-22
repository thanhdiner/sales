import React from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageCircle } from 'lucide-react'
import { viewport, workingHours } from '../constants'

const WorkingHoursCard = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-7">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Thời gian hoạt động
        </h3>
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Khung giờ hỗ trợ và phản hồi khách hàng.
        </p>
      </div>

      <div className="space-y-3">
        {workingHours.map((schedule, index) => (
          <motion.div
            key={schedule.day}
            className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
            viewport={viewport}
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {schedule.day}
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {schedule.time}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Lưu ý phản hồi
        </h4>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Ngoài giờ hành chính, bên mình vẫn kiểm tra tin nhắn định kỳ và ưu tiên phản hồi các yêu cầu khẩn.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a
          href="https://zalo.me/0823387108"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
        >
          <MessageCircle className="h-4 w-4" />
          Nhắn Zalo
        </a>

        <a
          href="mailto:smartmallhq@gmail.com"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <Mail className="h-4 w-4" />
          Gửi email
        </a>
      </div>
    </div>
  )
}

export default WorkingHoursCard