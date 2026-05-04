import { Heart, ShoppingBag } from 'lucide-react'
import ClientBreadcrumb from '@/components/client/Breadcrumb'
import MobileBackButton from '@/components/shared/MobileBackButton'
import SEO from '@/components/shared/SEO'
import { OUTLINE_BUTTON } from '../constants'

function EmptyWishlistState({ onBrowseProducts, t }) {
  return (
    <div className="bg-slate-50 px-4 py-8 dark:bg-gray-900 sm:py-10">
      <SEO title={t('seo.titleDetail')} noIndex />

      <div className="mx-auto w-full max-w-[1180px]">
        <ClientBreadcrumb
          className="mb-4 hidden md:flex"
          label={t('breadcrumb.label')}
          items={[
            { label: t('breadcrumb.home'), to: '/' },
            { label: t('breadcrumb.wishlist') }
          ]}
        />

        <MobileBackButton />

        <section className="flex min-h-[360px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm dark:border-white/5 dark:bg-white/[0.03] sm:py-20">
        <div className="mx-auto flex max-w-[520px] flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-rose-200/70 bg-rose-50 text-rose-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-rose-300/15 dark:bg-rose-500/10 dark:text-rose-300 dark:shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
            <Heart aria-hidden="true" className="h-9 w-9" strokeWidth={1.8} />
          </div>

          <h2 className="mt-6 text-2xl font-extrabold text-slate-950 dark:text-gray-100 sm:text-3xl">{t('empty.title')}</h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-gray-400">{t('empty.description')}</p>

          <button type="button" onClick={onBrowseProducts} className={`mx-auto mt-8 h-11 px-7 text-sm ${OUTLINE_BUTTON}`}>
            <ShoppingBag className="h-4 w-4" />
            {t('empty.button')}
          </button>
        </div>
        </section>
      </div>
    </div>
  )
}

export default EmptyWishlistState
