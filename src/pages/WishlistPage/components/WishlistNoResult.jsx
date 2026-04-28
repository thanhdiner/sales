import { Heart } from 'lucide-react'
import { OUTLINE_BUTTON } from '../constants'

function WishlistNoResult({ onFilterReset, t }) {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-gray-700">
        <Heart className="h-8 w-8 text-slate-400" />
      </div>

      <h3 className="text-lg font-extrabold text-slate-950 dark:text-gray-100">{t('noResult.title')}</h3>

      <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">{t('noResult.description')}</p>

      <button onClick={onFilterReset} className={`mt-5 h-10 px-6 text-sm ${OUTLINE_BUTTON}`}>
        {t('noResult.button')}
      </button>
    </div>
  )
}

export default WishlistNoResult
