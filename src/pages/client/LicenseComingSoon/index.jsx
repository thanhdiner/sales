import { Link } from 'react-router-dom'
import SEO from '@/components/shared/SEO'
import ClientBreadcrumb from '@/components/client/Breadcrumb'
import { ArrowRight, BadgeCheck, FileCheck2, KeyRound, LockKeyhole, PackageCheck, ShieldCheck, Sparkles, Wrench } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useComingSoonContent } from '@/hooks/content/useComingSoonContent'
import { getTextValue } from '@/utils/contentText'

const LICENSE_CARDS = [KeyRound, ShieldCheck, Wrench]
const PROCESS_ICONS = [FileCheck2, BadgeCheck, PackageCheck]
const TRUST_ICONS = [LockKeyhole, Sparkles, ShieldCheck]

export default function LicenseComingSoon() {
  const { t } = useTranslation('clientComingSoon')
  const { data: content } = useComingSoonContent('license')

  const openSupport = message => {
    window.dispatchEvent(new CustomEvent('smartmall:chat-send', {
      detail: {
        message,
        currentPage: window.location.pathname
      }
    }))
  }

  return (
    <main className="license-coming-soon-page min-h-screen rounded-tl-[8px] rounded-tr-[8px] bg-white text-slate-950 shadow dark:bg-gray-950 dark:text-white">
      <SEO
        title={getTextValue(content?.seo?.title, t('license.seo.title'))}
        description={getTextValue(content?.seo?.description, t('license.description'))}
        url="https://smartmall.site/license"
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-5 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 sm:px-6 lg:px-8">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <ClientBreadcrumb
            className="mb-6"
            label={t('license.breadcrumb.label')}
            items={[
              { label: t('license.breadcrumb.home'), to: '/' },
              { label: t('license.breadcrumb.current') }
            ]}
          />

          <div className="grid gap-10 py-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {getTextValue(content?.status, t('license.status'))}
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {getTextValue(content?.title, t('license.title'))}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-gray-300 sm:text-lg">
                {getTextValue(content?.description, t('license.description'))} {getTextValue(content?.descriptionSecondLine, t('license.descriptionSecondLine'))}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/products" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700">
                  {t('license.hero.primaryAction')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => openSupport(t('license.hero.supportMessage'))}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50 dark:border-blue-400/20 dark:bg-white/5 dark:text-blue-200"
                >
                  {t('license.hero.secondaryAction')}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-2xl shadow-blue-500/10 dark:border-white/10 dark:bg-white/5">
              <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white dark:bg-gray-900">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">{t('license.hero.panelEyebrow')}</p>
                <h2 className="mt-2 text-2xl font-black">{t('license.hero.panelTitle')}</h2>
                <div className="mt-6 space-y-3">
                  {[0, 1, 2].map(index => {
                    const Icon = LICENSE_CARDS[index]
                    return (
                      <div key={t(`license.catalog.items.${index}.title`)} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                        <Icon className="mt-1 h-5 w-5 text-blue-300" aria-hidden="true" />
                        <div>
                          <h3 className="font-bold">{t(`license.catalog.items.${index}.title`)}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-300">{t(`license.catalog.items.${index}.description`)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">{t('license.catalog.eyebrow')}</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">{t('license.catalog.title')}</h2>
            <p className="mt-3 text-slate-600 dark:text-gray-300">{t('license.catalog.description')}</p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {LICENSE_CARDS.map((Icon, index) => (
              <article key={t(`license.catalog.items.${index}.title`)} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                <Icon className="h-8 w-8 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-black">{t(`license.catalog.items.${index}.title`)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-300">{t(`license.catalog.items.${index}.description`)}</p>
                <button type="button" onClick={() => openSupport(t('license.catalog.supportMessage', { product: t(`license.catalog.items.${index}.title`) }))} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-300">
                  {t('license.catalog.action')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-4 py-14 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">{t('license.process.eyebrow')}</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">{t('license.process.title')}</h2>
            <p className="mt-3 text-slate-600 dark:text-gray-300">{t('license.process.description')}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {PROCESS_ICONS.map((Icon, index) => (
              <div key={t(`license.process.steps.${index}.title`)} className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-950">
                <Icon className="h-7 w-7 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                <p className="mt-5 text-sm font-black text-slate-400">0{index + 1}</p>
                <h3 className="mt-2 font-black">{t(`license.process.steps.${index}.title`)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-300">{t(`license.process.steps.${index}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-950 p-7 text-white dark:bg-gray-900">
          <div className="grid gap-6 md:grid-cols-3">
            {TRUST_ICONS.map((Icon, index) => (
              <div key={t(`license.trust.${index}.title`)}>
                <Icon className="h-7 w-7 text-blue-300" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-black">{t(`license.trust.${index}.title`)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{t(`license.trust.${index}.description`)}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <h2 className="text-2xl font-black">{t('license.cta.title')}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{t('license.cta.description')}</p>
            </div>
            <Link to="/contact" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-100 md:mt-0">
              {t('license.cta.button')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
