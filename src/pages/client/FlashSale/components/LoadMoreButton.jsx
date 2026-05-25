import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { FLASH_SALE_FADE_UP_VARIANTS, FLASH_SALE_VIEWPORT } from '../constants'

export default function LoadMoreButton({ loadingMore, onLoadMore, t }) {
  return (
    <motion.div
      className="mt-8 flex justify-center"
      initial="hidden"
      whileInView="visible"
      variants={FLASH_SALE_FADE_UP_VARIANTS}
      viewport={FLASH_SALE_VIEWPORT}
    >
      <button
        type="button"
        onClick={onLoadMore}
        disabled={loadingMore}
        className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-black text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/20 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-500/10"
      >
        {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
        {loadingMore ? t('loadMore.loading') : t('loadMore.default')}
      </button>
    </motion.div>
  )
}
