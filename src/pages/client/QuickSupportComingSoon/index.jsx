import SEO from '@/components/shared/SEO'
import ClientBreadcrumb from '@/components/client/Breadcrumb'
import { ArrowRight, Bot, Clock3, Headphones, HelpCircle, MessageCircle, PackageSearch, ReceiptText, ShieldQuestion, TicketCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useComingSoonContent } from '@/hooks/content/useComingSoonContent'
import { getTextValue } from '@/utils/contentText'

const SUPPORT_CARDS = [MessageCircle, PackageSearch, ReceiptText, ShieldQuestion]
const FAQ_ITEMS = [0, 1, 2, 3]

export default function QuickSupportComingSoon() {
  const { t } = useTranslation('clientComingSoon')
  const navigate = useNavigate()
  const { data: content } = useComingSoonContent('quick-support')

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
        title={getTextValue(content?.seo?.title, t('quickSupport.seo.title'))}
        description={getTextValue(content?.seo?.description, t('quickSupport.description'))}
        url="https://smartmall.site/quick-support"
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-5 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950 sm:px-6 lg:px-8">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <ClientBreadcrumb
            className="mb-6"
            label={t('quickSupport.breadcrumb.label')}
            items={[
              { label: t('quickSupport.breadcrumb.home'), to: '/' },
              { label: t('quickSupport.breadcrumb.current') }
            ]}
          />

          <div className="grid gap-10 py-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-bold text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
                <Headphones className="h-4 w-4" aria-hidden="true" />
                {getTextValue(content?.status, t('quickSupport.status'))}
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {getTextValue(content?.title, t('quickSupport.title'))}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-gray-300 sm:text-lg">
                {getTextValue(content?.description, t('quickSupport.description'))} {getTextValue(content?.descriptionSecondLine, t('quickSupport.descriptionSecondLine'))}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openSupport(t('quickSupport.hero.supportMessage'))}
                  className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-600"
                >
                  {t('quickSupport.hero.primaryAction')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/orders')}
                  className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50 dark:border-teal-400/20 dark:bg-white/5 dark:text-teal-200"
                >
                  {t('quickSupport.hero.secondaryAction')}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-teal-100 bg-white p-5 shadow-2xl shadow-teal-500/10 dark:border-white/10 dark:bg-white/5">
              <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                    <Bot className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-black">{t('quickSupport.assistant.title')}</h2>
                    <p className="text-sm text-teal-100">{t('quickSupport.assistant.status')}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {[0, 1, 2].map(index => (
                    <div key={t(`quickSupport.assistant.messages.${index}`)} className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-slate-200">
                      {t(`quickSupport.assistant.messages.${index}`)}
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
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-600">{t('quickSupport.actions.eyebrow')}</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">{t('quickSupport.actions.title')}</h2>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {SUPPORT_CARDS.map((Icon, index) => (
              <button
                key={t(`quickSupport.actions.items.${index}.title`)}
                type="button"
                onClick={() => index === 1 ? navigate('/orders') : openSupport(t(`quickSupport.actions.items.${index}.message`))}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-left transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <Icon className="h-8 w-8 text-teal-500" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-black">{t(`quickSupport.actions.items.${index}.title`)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-300">{t(`quickSupport.actions.items.${index}.description`)}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-4 py-14 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-slate-950 p-7 text-white dark:bg-gray-950">
            <Clock3 className="h-8 w-8 text-teal-300" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-black">{t('quickSupport.sla.title')}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t('quickSupport.sla.description')}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[0, 1, 2].map(index => (
                <div key={t(`quickSupport.sla.items.${index}.value`)} className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-black text-teal-300">{t(`quickSupport.sla.items.${index}.value`)}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-300">{t(`quickSupport.sla.items.${index}.label`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-7 shadow-sm dark:bg-gray-950">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-300">
              <HelpCircle className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">{t('quickSupport.faq.eyebrow')}</span>
            </div>
            <h2 className="mt-3 text-2xl font-black">{t('quickSupport.faq.title')}</h2>
            <div className="mt-5 space-y-3">
              {FAQ_ITEMS.map(index => (
                <details key={t(`quickSupport.faq.items.${index}.question`)} className="group rounded-2xl border border-slate-200 p-4 dark:border-gray-800">
                  <summary className="cursor-pointer list-none font-bold text-slate-900 dark:text-white">
                    {t(`quickSupport.faq.items.${index}.question`)}
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-gray-300">{t(`quickSupport.faq.items.${index}.answer`)}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-teal-100 bg-teal-50 p-7 dark:border-teal-400/10 dark:bg-teal-400/10 md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <TicketCheck className="h-8 w-8 text-teal-600 dark:text-teal-300" />
            <h2 className="mt-4 text-2xl font-black">{t('quickSupport.cta.title')}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-gray-300">{t('quickSupport.cta.description')}</p>
          </div>
          <Link to="/contact" className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-600 dark:bg-white dark:text-slate-950 md:mt-0">
            {t('quickSupport.cta.button')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
