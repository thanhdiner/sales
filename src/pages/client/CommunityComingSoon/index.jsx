import { Link } from 'react-router-dom'
import SEO from '@/components/shared/SEO'
import ClientBreadcrumb from '@/components/client/Breadcrumb'
import { ArrowRight, CalendarDays, Gamepad2, MessageCircle, ShieldCheck, Trophy, Users, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useComingSoonContent } from '@/hooks/content/useComingSoonContent'
import { getTextValue } from '@/utils/contentText'

const COMMUNITY_FEATURE_ICONS = [MessageCircle, Trophy, CalendarDays]
const COMMUNITY_VALUE_ICONS = [ShieldCheck, Zap, Gamepad2]

export default function CommunityComingSoon() {
  const { t } = useTranslation('clientComingSoon')
  const { data: content } = useComingSoonContent('community')

  const openSupport = message => {
    window.dispatchEvent(new CustomEvent('smartmall:chat-send', {
      detail: {
        message,
        currentPage: window.location.pathname
      }
    }))
  }

  return (
    <main className="min-h-screen rounded-tl-[8px] rounded-tr-[8px] bg-white text-slate-950 shadow dark:bg-gray-950 dark:text-white">
      <SEO
        title={getTextValue(content?.seo?.title, t('community.seo.title'))}
        description={getTextValue(content?.seo?.description, t('community.description'))}
        url="https://smartmall.site/community"
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-5 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 sm:px-6 lg:px-8">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <ClientBreadcrumb
            className="mb-6"
            label={t('community.breadcrumb.label')}
            items={[
              { label: t('community.breadcrumb.home'), to: '/' },
              { label: t('community.breadcrumb.current') }
            ]}
          />

          <div className="grid gap-10 py-10 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:py-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700 dark:bg-purple-400/10 dark:text-purple-300">
                <Users className="h-4 w-4" aria-hidden="true" />
                {getTextValue(content?.status, t('community.status'))}
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {getTextValue(content?.title, t('community.title'))}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-gray-300 sm:text-lg">
                {getTextValue(content?.description, t('community.description'))} {getTextValue(content?.descriptionSecondLine, t('community.descriptionSecondLine'))}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openSupport(t('community.hero.supportMessage'))}
                  className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition hover:bg-purple-700"
                >
                  {t('community.hero.primaryAction')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <Link to="/blog" className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-6 py-3 text-sm font-bold text-purple-700 transition hover:bg-purple-50 dark:border-purple-400/20 dark:bg-white/5 dark:text-purple-200">
                  {t('community.hero.secondaryAction')}
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-purple-100 bg-white p-5 shadow-2xl shadow-purple-500/10 dark:border-white/10 dark:bg-white/5">
              <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white dark:bg-gray-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-300">{t('community.hero.panelEyebrow')}</p>
                    <h2 className="mt-2 text-2xl font-black">{t('community.hero.panelTitle')}</h2>
                  </div>
                  <Users className="h-10 w-10 text-purple-300" aria-hidden="true" />
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {[0, 1, 2].map(index => (
                    <div key={t(`community.stats.${index}.label`)} className="rounded-2xl bg-white/10 p-4">
                      <p className="text-2xl font-black text-purple-200">{t(`community.stats.${index}.value`)}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-300">{t(`community.stats.${index}.label`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-purple-600">{t('community.features.eyebrow')}</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">{t('community.features.title')}</h2>
            <p className="mt-3 text-slate-600 dark:text-gray-300">{t('community.features.description')}</p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {COMMUNITY_FEATURE_ICONS.map((Icon, index) => (
              <article key={t(`community.features.items.${index}.title`)} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                <Icon className="h-8 w-8 text-purple-600 dark:text-purple-300" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-black">{t(`community.features.items.${index}.title`)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-300">{t(`community.features.items.${index}.description`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-4 py-14 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-purple-600">{t('community.values.eyebrow')}</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">{t('community.values.title')}</h2>
            <p className="mt-3 text-slate-600 dark:text-gray-300">{t('community.values.description')}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {COMMUNITY_VALUE_ICONS.map((Icon, index) => (
              <div key={t(`community.values.items.${index}.title`)} className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-950">
                <Icon className="h-7 w-7 text-purple-600 dark:text-purple-300" aria-hidden="true" />
                <h3 className="mt-4 font-black">{t(`community.values.items.${index}.title`)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-300">{t(`community.values.items.${index}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-950 p-7 text-white dark:bg-gray-900 md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <h2 className="text-2xl font-black">{t('community.cta.title')}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{t('community.cta.description')}</p>
          </div>
          <button type="button" onClick={() => openSupport(t('community.cta.supportMessage'))} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-purple-100 md:mt-0">
            {t('community.cta.button')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  )
}
