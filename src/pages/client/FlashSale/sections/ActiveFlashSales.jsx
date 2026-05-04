import { Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { FLASH_SALE_VIEWPORT } from '../constants'
import { calculateTimeLeft, formatDateTime, getProgressPercent } from '../utils/flashSaleUtils'
import FlashSaleProductCard from '../components/FlashSaleProductCard'
import StatusBadge from '../components/StatusBadge'
import TimeBox from '../components/TimeBox'

export default function ActiveFlashSales({
  activeFlashSales,
  currentTime,
  productCardProps,
  t
}) {
  if (!activeFlashSales.length) return null

  return (
    <section id="active-sale-section" className="mt-6 space-y-8">
      {activeFlashSales.map((sale, saleIndex) => {
        const timeLeft = calculateTimeLeft(sale.endAt, currentTime)
        const progressPercent = getProgressPercent(sale)

        return (
          <motion.article
            key={sale._id}
            className="space-y-4"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: saleIndex * 0.06, ease: 'easeOut' }}
            viewport={FLASH_SALE_VIEWPORT}
          >
            <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm dark:border-red-500/20 dark:bg-slate-900">
              <div className="border-b border-red-100 bg-gradient-to-r from-red-50 to-orange-50 p-4 dark:border-red-500/20 dark:from-red-500/10 dark:to-orange-500/10 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <StatusBadge status={sale.status} t={t} />

                      <span className="inline-flex items-center rounded-md bg-white px-2.5 py-1 text-xs font-black text-red-600 shadow-sm dark:bg-slate-950 dark:text-red-300">
                        {t('sale.discount', { percent: sale.discountPercent })}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">{sale.name}</h2>

                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                      <Clock className="h-4 w-4" />
                      {t('time.range', {
                        start: formatDateTime(sale.startAt),
                        end: formatDateTime(sale.endAt)
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <TimeBox value={timeLeft.days} label={t('time.day')} />
                    <TimeBox value={timeLeft.hours} label={t('time.hour')} />
                    <TimeBox value={timeLeft.minutes} label={t('time.minute')} />
                    <TimeBox value={timeLeft.seconds} label={t('time.second')} />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>
                      {t('sale.soldProgress', {
                        sold: sale.soldQuantity,
                        max: sale.maxQuantity
                      })}
                    </span>
                    <span>{progressPercent}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                    <span className="h-5 w-1 rounded-full bg-red-600" />
                    {t('sale.activeProductsTitle')}
                  </h3>

                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t('sale.productCount', { count: sale.products?.length || 0 })}
                  </span>
                </div>

                <div className="grid auto-rows-fr grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {(sale.products || []).map(product => (
                    <FlashSaleProductCard key={product._id || product.id} product={product} sale={sale} t={t} {...productCardProps} />
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
        )
      })}
    </section>
  )
}