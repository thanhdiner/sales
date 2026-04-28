import { Bell, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { FLASH_SALE_VIEWPORT } from '../constants'
import { formatDateTime, getTimeUntilStart } from '../utils/flashSalePageUtils'
import StatusBadge from './StatusBadge'
import TimeBox from './TimeBox'

export default function UpcomingFlashSalesSection({ currentTime, t, upcomingFlashSales }) {
  if (!upcomingFlashSales.length) return null

  return (
    <section id="upcoming-sale-section" className="mt-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-black text-slate-950 dark:text-white">
          <Clock className="h-5 w-5 text-amber-500" />
          {t('sale.upcomingTitle')}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {upcomingFlashSales.map((sale, saleIndex) => {
          const timeUntilStart = getTimeUntilStart(sale.startAt, currentTime)

          return (
            <motion.article
              key={sale._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: saleIndex * 0.05, ease: 'easeOut' }}
              viewport={FLASH_SALE_VIEWPORT}
            >
              <div className="border-b border-slate-200 bg-amber-50 p-4 dark:border-slate-800 dark:bg-amber-500/10">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={sale.status} t={t} />

                  <span className="rounded-md bg-white px-2.5 py-1 text-xs font-black text-amber-700 shadow-sm dark:bg-slate-950 dark:text-amber-300">
                    {t('sale.discount', { percent: sale.discountPercent })}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-950 dark:text-white">{sale.name}</h3>

                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {t('time.fromTo', {
                    start: formatDateTime(sale.startAt),
                    end: formatDateTime(sale.endAt)
                  })}
                </p>

                {timeUntilStart && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <TimeBox value={timeUntilStart.days} label={t('time.day')} />
                    <TimeBox value={timeUntilStart.hours} label={t('time.hour')} />
                    <TimeBox value={timeUntilStart.minutes} label={t('time.minute')} />
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {t('sale.participatingProducts', { count: sale.products?.length || 0 })}
                  </p>

                  <span className="text-xs font-bold text-amber-600 dark:text-amber-300">{t('sale.upcomingSelling')}</span>
                </div>

                <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 py-2.5 text-sm font-black text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/15">
                  <Bell className="h-4 w-4" />
                  {t('sale.remindMe')}
                </button>
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
