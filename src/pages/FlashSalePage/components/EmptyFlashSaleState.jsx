import { Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { FLASH_SALE_VIEWPORT } from '../constants'

export default function EmptyFlashSaleState({ t }) {
  return (
    <motion.div
      className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      viewport={FLASH_SALE_VIEWPORT}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Clock className="h-7 w-7 text-slate-400" />
      </div>

      <h3 className="text-lg font-black text-slate-800 dark:text-white">{t('empty.title')}</h3>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('empty.description')}</p>
    </motion.div>
  )
}
