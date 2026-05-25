import React from 'react'
import { motion } from 'framer-motion'
import { Clock3 } from 'lucide-react'
import { viewport } from '../constants'

const WorkingHoursCard = ({ content = {} }) => {
  return (
    <div className="contact-card contact-request-card rounded-xl border border-orange-100 bg-white p-5 shadow-[0_16px_38px_rgba(154,77,38,0.08)] dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div className="mb-6 flex items-start gap-3">
        <span className="contact-request-icon mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <Clock3 className="h-5 w-5" />
        </span>

        <div>
          <h3 className="contact-card-title text-lg font-semibold leading-tight text-gray-900 dark:text-gray-100">
            {content.title}
          </h3>

          <p className="contact-muted-text mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {content.description}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {(content.items || []).map((schedule, index) => (
          <motion.div
            key={schedule.type}
            className="contact-card-row flex items-center justify-between gap-4 border-b border-orange-100 !bg-white pb-4 last:border-b-0 last:pb-0 dark:!border-orange-100 dark:!bg-white"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
            viewport={viewport}
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="contact-request-icon contact-request-icon--small flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <Clock3 className="h-4 w-4" />
              </span>

              <span className="contact-muted-text text-sm font-semibold text-gray-700 dark:text-gray-300">
                {schedule.day}
              </span>
            </span>

            <span className="contact-card-title text-sm font-semibold text-gray-900 dark:text-gray-100">
              {schedule.time}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="contact-muted-box mt-6 rounded-xl border border-orange-50 bg-orange-50/70 p-4 dark:border-gray-700 dark:bg-gray-900/30">
        <h4 className="contact-card-title text-sm font-semibold text-gray-900 dark:text-gray-100">
          {content.noteTitle}
        </h4>

        <p className="contact-muted-text mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {content.noteDescription}
        </p>
      </div>
    </div>
  )
}

export default WorkingHoursCard
