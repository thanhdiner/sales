import { ArrowRight, Gift } from 'lucide-react'
import { motion } from 'framer-motion'
import { FLASH_SALE_CARD_VARIANTS, FLASH_SALE_FADE_UP_VARIANTS, FLASH_SALE_STAGGER_VARIANTS, FLASH_SALE_VIEWPORT } from '../constants'
import { calculateTimeLeft, formatDateTime, getProgressPercent } from '../utils/flashSaleUtils'
import FlashSaleProductCard from '../components/FlashSaleProductCard'
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
            initial="hidden"
            whileInView="visible"
            variants={FLASH_SALE_STAGGER_VARIANTS}
            transition={{ delay: saleIndex * 0.04 }}
            viewport={FLASH_SALE_VIEWPORT}
          >
            <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm dark:border-white/10 dark:bg-[#101213]">
              <motion.div className="flash-sale-hero" variants={FLASH_SALE_FADE_UP_VARIANTS}>
                <motion.div className="flash-sale-hero__gift" aria-hidden="true" variants={FLASH_SALE_CARD_VARIANTS}>
                  <Gift className="flash-sale-hero__gift-icon" />
                </motion.div>

                <motion.div className="flash-sale-hero__divider" variants={FLASH_SALE_FADE_UP_VARIANTS} />

                <motion.div className="flash-sale-hero__content" variants={FLASH_SALE_FADE_UP_VARIANTS}>
                  <div className="flash-sale-hero__meta">
                    <span className="flash-sale-hero__badge">Flash Sale</span>
                    <span className="flash-sale-hero__discount">{t('sale.discount', { percent: sale.discountPercent })}</span>
                  </div>

                  <h2 className="flash-sale-hero__title">{sale.name}</h2>

                  <p className="flash-sale-hero__subtitle">
                    {t('time.range', {
                      start: formatDateTime(sale.startAt),
                      end: formatDateTime(sale.endAt)
                    })}
                  </p>
                </motion.div>

                <motion.div className="flash-sale-hero__timer" aria-label={t('time.range', { start: formatDateTime(sale.startAt), end: formatDateTime(sale.endAt) })} variants={FLASH_SALE_FADE_UP_VARIANTS}>
                  <TimeBox value={timeLeft.days} label={t('time.day')} variant="hero" />
                  <TimeBox value={timeLeft.hours} label={t('time.hour')} variant="hero" />
                  <TimeBox value={timeLeft.minutes} label={t('time.minute')} variant="hero" />
                  <TimeBox value={timeLeft.seconds} label={t('time.second')} variant="hero" />
                </motion.div>

                <motion.a className="flash-sale-hero__cta" href={`#flash-sale-products-${sale._id}`} aria-label={t('sale.activeProductsTitle')} variants={FLASH_SALE_CARD_VARIANTS}>
                  <ArrowRight className="flash-sale-hero__cta-icon" />
                </motion.a>
              </motion.div>

              <motion.div className="flash-sale-progress px-4 pt-4 sm:px-5" variants={FLASH_SALE_FADE_UP_VARIANTS}>
                <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>
                    {t('sale.soldProgress', {
                      sold: sale.soldQuantity,
                      max: sale.maxQuantity
                    })}
                  </span>
                  <span>{progressPercent}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-red-50 dark:bg-[#070809]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-300"
                    initial={{ width: '0%' }}
                    whileInView={{ width: `${progressPercent}%` }}
                    viewport={FLASH_SALE_VIEWPORT}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>

              <motion.div id={`flash-sale-products-${sale._id}`} className="p-4 sm:p-5" variants={FLASH_SALE_STAGGER_VARIANTS}>
                <motion.div className="mb-4 flex items-center justify-between gap-3" variants={FLASH_SALE_FADE_UP_VARIANTS}>
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                    <span className="h-5 w-1 rounded-full bg-red-600" />
                    {t('sale.activeProductsTitle')}
                  </h3>

                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t('sale.productCount', { count: sale.products?.length || 0 })}
                  </span>
                </motion.div>

                <motion.div className="grid auto-rows-fr grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" variants={FLASH_SALE_STAGGER_VARIANTS}>
                  {(sale.products || []).map(product => (
                    <motion.div key={product._id || product.id} className="h-full" variants={FLASH_SALE_CARD_VARIANTS}>
                      <FlashSaleProductCard product={product} sale={sale} t={t} {...productCardProps} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.article>
        )
      })}
    </section>
  )
}
