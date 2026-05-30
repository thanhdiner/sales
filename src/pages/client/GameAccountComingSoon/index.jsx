import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CheckCircle2, Gamepad2, Search, ShieldCheck, SlidersHorizontal, Sparkles, Star, Zap } from 'lucide-react'
import ClientBreadcrumb from '@/components/client/Breadcrumb'
import SEO from '@/components/shared/SEO'
import { getTextValue } from '@/utils/contentText'
import { useGameAccountContent } from './useGameAccountContent'

const ACCOUNT_FILTERS = ['all', 'genshin', 'lol', 'valorant', 'steam']
const ACCOUNT_CARDS = [
  {
    key: 'genshin',
    badge: 'gameAccount.catalog.items.genshin.badge',
    title: 'gameAccount.catalog.items.genshin.title',
    description: 'gameAccount.catalog.items.genshin.description',
    price: 'gameAccount.catalog.items.genshin.price',
    features: [
      'gameAccount.catalog.items.genshin.features.0',
      'gameAccount.catalog.items.genshin.features.1',
      'gameAccount.catalog.items.genshin.features.2'
    ]
  },
  {
    key: 'lol',
    badge: 'gameAccount.catalog.items.lol.badge',
    title: 'gameAccount.catalog.items.lol.title',
    description: 'gameAccount.catalog.items.lol.description',
    price: 'gameAccount.catalog.items.lol.price',
    features: [
      'gameAccount.catalog.items.lol.features.0',
      'gameAccount.catalog.items.lol.features.1',
      'gameAccount.catalog.items.lol.features.2'
    ]
  },
  {
    key: 'valorant',
    badge: 'gameAccount.catalog.items.valorant.badge',
    title: 'gameAccount.catalog.items.valorant.title',
    description: 'gameAccount.catalog.items.valorant.description',
    price: 'gameAccount.catalog.items.valorant.price',
    features: [
      'gameAccount.catalog.items.valorant.features.0',
      'gameAccount.catalog.items.valorant.features.1',
      'gameAccount.catalog.items.valorant.features.2'
    ]
  },
  {
    key: 'steam',
    badge: 'gameAccount.catalog.items.steam.badge',
    title: 'gameAccount.catalog.items.steam.title',
    description: 'gameAccount.catalog.items.steam.description',
    price: 'gameAccount.catalog.items.steam.price',
    features: [
      'gameAccount.catalog.items.steam.features.0',
      'gameAccount.catalog.items.steam.features.1',
      'gameAccount.catalog.items.steam.features.2'
    ]
  }
]
const TRUST_ITEMS = [ShieldCheck, Zap, Star]
const PROCESS_ICONS = [Search, SlidersHorizontal, CheckCircle2]

export default function GameAccountComingSoon() {
  const { t } = useTranslation('clientComingSoon')
  const navigate = useNavigate()
  const { data: content } = useGameAccountContent()
  const [activeFilter, setActiveFilter] = useState('all')
  const filteredCards = useMemo(
    () => activeFilter === 'all' ? ACCOUNT_CARDS : ACCOUNT_CARDS.filter(item => item.key === activeFilter),
    [activeFilter]
  )

  const openSupport = message => {
    window.dispatchEvent(new CustomEvent('smartmall:chat-send', {
      detail: {
        message,
        currentPage: window.location.pathname
      }
    }))
  }

  return (
    <main className="min-h-screen rounded-tl-[8px] rounded-tr-[8px] bg-slate-950 text-white shadow dark:bg-[#101213]">
      <SEO
        title={getTextValue(content?.seo?.title, t('gameAccount.seo.title'))}
        description={getTextValue(content?.seo?.description, t('gameAccount.description'))}
        url="https://smartmall.site/game-account"
      />

      <section className="relative overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.25),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <ClientBreadcrumb
            className="mb-6 text-slate-300 dark:text-slate-300"
            label={t('gameAccount.breadcrumb.label')}
            items={[
              { label: t('gameAccount.breadcrumb.home'), to: '/' },
              { label: t('gameAccount.breadcrumb.current') }
            ]}
          />

          <div className="grid gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur">
                <Gamepad2 className="h-4 w-4" aria-hidden="true" />
                {getTextValue(content?.eyebrow, t('gameAccount.eyebrow'))}
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {getTextValue(content?.title, t('gameAccount.title'))}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                {getTextValue(content?.description, t('gameAccount.description'))}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-300"
                >
                  {t('gameAccount.hero.primaryAction')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => openSupport(t('gameAccount.hero.supportMessage'))}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  {t('gameAccount.hero.secondaryAction')}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-white p-5 text-slate-950 dark:bg-slate-900 dark:text-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-500">{t('gameAccount.hero.previewEyebrow')}</p>
                    <h2 className="mt-2 text-2xl font-black">{t('gameAccount.hero.previewTitle')}</h2>
                  </div>
                  <Sparkles className="h-9 w-9 text-amber-400" aria-hidden="true" />
                </div>
                <div className="mt-5 grid gap-3">
                  {ACCOUNT_CARDS.slice(0, 3).map(item => (
                    <div key={item.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-500">{t(item.badge)}</p>
                          <h3 className="mt-1 font-bold">{t(item.title)}</h3>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                          {t(item.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 text-slate-950 dark:bg-gray-900 dark:text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            {TRUST_ITEMS.map((Icon, index) => (
              <div key={t(`gameAccount.trust.${index}.title`)} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                <Icon className="h-8 w-8 text-cyan-500" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-bold">{t(`gameAccount.trust.${index}.title`)}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-300">{t(`gameAccount.trust.${index}.description`)}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-600">{t('gameAccount.catalog.eyebrow')}</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">{t('gameAccount.catalog.title')}</h2>
              <p className="mt-3 max-w-2xl text-slate-600 dark:text-gray-300">{t('gameAccount.catalog.description')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {ACCOUNT_FILTERS.map(filter => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${activeFilter === filter
                    ? 'border-cyan-500 bg-cyan-500 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200'}`}
                >
                  {t(`gameAccount.filters.${filter}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {filteredCards.map(item => (
              <article key={item.key} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-gray-800 dark:bg-gray-800/80">
                <span className="self-start rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
                  {t(item.badge)}
                </span>
                <h3 className="mt-4 text-xl font-black">{t(item.title)}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-gray-300">{t(item.description)}</p>
                <ul className="mt-4 space-y-2">
                  {item.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-700 dark:text-gray-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                      {t(feature)}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-gray-700">
                  <span className="text-sm font-black text-cyan-600 dark:text-cyan-300">{t(item.price)}</span>
                  <button type="button" onClick={() => openSupport(t('gameAccount.catalog.supportMessage', { account: t(item.title) }))} className="text-sm font-bold text-slate-950 hover:text-cyan-600 dark:text-white dark:hover:text-cyan-300">
                    {t('gameAccount.catalog.action')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-4 py-14 text-slate-950 dark:bg-gray-950 dark:text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-3">
            {PROCESS_ICONS.map((Icon, index) => (
              <div key={t(`gameAccount.process.steps.${index}.title`)} className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-slate-400">0{index + 1}</p>
                <h2 className="mt-2 text-xl font-black">{t(`gameAccount.process.steps.${index}.title`)}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-300">{t(`gameAccount.process.steps.${index}.description`)}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] bg-slate-950 p-7 text-white dark:bg-gray-900 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <h2 className="text-2xl font-black">{t('gameAccount.cta.title')}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{getTextValue(content?.note, t('gameAccount.cta.description'))}</p>
            </div>
            <button type="button" onClick={() => navigate('/contact')} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-100 md:mt-0">
              {t('gameAccount.cta.button')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
