import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Info, MessageCircle, Mail } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import { workingHours, viewport } from '../constants'

const FormAndScheduleSection = () => {
  return (
    <motion.section
      className="px-4 py-12 md:py-20"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={viewport}
        >
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.28em] text-emerald-600">
            Gửi yêu cầu
          </p>
          <h2 className="text-[32px] font-extrabold tracking-[-1.2px] text-[#111] md:text-[40px] dark:text-white">
            Gửi thông tin nhanh, nhận hỗ trợ đúng lúc
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-[16px] font-medium leading-[1.8] text-[#64607d] dark:text-gray-400">
            Bạn có thể gửi yêu cầu trực tiếp qua biểu mẫu hoặc xem khung giờ hoạt động để nhận phản hồi nhanh hơn.
          </p>
        </motion.div>

        <div className="grid items-start gap-8 lg:grid-cols-12">
          {/* Contact Form */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            viewport={viewport}
          >
            <div className="rounded-[28px] border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="rounded-[22px] bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 p-1 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
                <ContactForm />
              </div>
            </div>
          </motion.div>

          {/* Working hours sidebar */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
            viewport={viewport}
          >
            <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="rounded-[22px] bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/30 p-6 md:p-7 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700/30">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold text-[#0f172a] dark:text-white">
                      Thời gian hoạt động
                    </h3>
                    <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
                      Cập nhật hằng ngày
                    </p>
                  </div>
                </div>

                {/* Schedule items */}
                <div className="mt-6 space-y-3">
                  {workingHours.map((schedule, index) => {
                    const isWeekend = schedule.type === 'sunday'
                    const isSaturday = schedule.type === 'saturday'
                    return (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm dark:border-gray-600 dark:bg-gray-700/50"
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
                        viewport={viewport}
                      >
                        <span className="flex items-center gap-3 font-medium text-gray-700 dark:text-gray-300">
                          <span
                            className={`h-3 w-3 rounded-full ${
                              isWeekend ? 'bg-amber-400' : isSaturday ? 'bg-blue-400' : 'bg-emerald-500'
                            }`}
                          />
                          {schedule.day}
                        </span>
                        <span className="rounded-xl bg-gray-100 px-3 py-1.5 text-[14px] font-bold text-[#0f172a] dark:bg-gray-600 dark:text-white">
                          {schedule.time}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Info note */}
                <div className="mt-6 rounded-2xl border border-emerald-200/60 bg-emerald-50/70 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                  <div className="flex items-center gap-2 text-[14px] font-bold text-emerald-700 dark:text-emerald-300">
                    <Info className="h-4 w-4" />
                    Lưu ý phản hồi
                  </div>
                  <p className="mt-2 text-[13px] leading-[1.7] text-emerald-700/80 dark:text-emerald-300/80">
                    Ngoài giờ hành chính, bên mình vẫn kiểm tra tin nhắn định kỳ và ưu tiên phản hồi các yêu cầu khẩn.
                  </p>
                </div>

                {/* Quick actions */}
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <a
                    href="https://zalo.me/0823387108"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-blue-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Nhắn Zalo ngay
                  </a>
                  <a
                    href="mailto:smartmallhq@gmail.com"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-semibold text-gray-800 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    <Mail className="h-4 w-4" />
                    Gửi email
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default FormAndScheduleSection
