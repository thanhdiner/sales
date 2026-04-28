import { ShoppingBag } from 'lucide-react'
import SEO from '@/components/SEO'

function EmptyCartState({ onContinueShopping, t }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEO title={t('seo.title')} noIndex />

      <div className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-10">
          <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40">
              <ShoppingBag className="h-11 w-11 text-blue-600" />
            </div>

            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{t('empty.title')}</h2>

            <p className="mb-7 text-gray-500 dark:text-gray-400">{t('empty.description')}</p>

            <button
              onClick={onContinueShopping}
              className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              {t('empty.button')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyCartState
