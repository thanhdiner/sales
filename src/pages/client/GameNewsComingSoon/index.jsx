import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Clock3, Flame, Newspaper, Search, Sparkles, Tags } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ClientBreadcrumb from '@/components/client/Breadcrumb'
import SEO from '@/components/shared/SEO'
import { getTextValue } from '@/utils/contentText'
import { useGameNewsContent } from './useGameNewsContent'

const CATEGORIES = ['all', 'updates', 'events', 'guides']
const ARTICLES = [
  {
    key: 'patch',
    category: 'updates',
    image: 'from-indigo-500 to-blue-500',
    title: 'gameNews.articles.patch.title',
    excerpt: 'gameNews.articles.patch.excerpt',
    readTime: 'gameNews.articles.patch.readTime',
    date: 'gameNews.articles.patch.date'
  },
  {
    key: 'event',
    category: 'events',
    image: 'from-orange-500 to-rose-500',
    title: 'gameNews.articles.event.title',
    excerpt: 'gameNews.articles.event.excerpt',
    readTime: 'gameNews.articles.event.readTime',
    date: 'gameNews.articles.event.date'
  },
  {
    key: 'guide',
    category: 'guides',
    image: 'from-emerald-500 to-teal-500',
    title: 'gameNews.articles.guide.title',
    excerpt: 'gameNews.articles.guide.excerpt',
    readTime: 'gameNews.articles.guide.readTime',
    date: 'gameNews.articles.guide.date'
  },
  {
    key: 'market',
    category: 'updates',
    image: 'from-violet-500 to-fuchsia-500',
    title: 'gameNews.articles.market.title',
    excerpt: 'gameNews.articles.market.excerpt',
    readTime: 'gameNews.articles.market.readTime',
    date: 'gameNews.articles.market.date'
  }
]
const TRENDING = ['gameNews.trending.0', 'gameNews.trending.1', 'gameNews.trending.2', 'gameNews.trending.3']

export default function GameNewsComingSoon() {
  const { t } = useTranslation('clientComingSoon')
  const { data: content } = useGameNewsContent()
  const [activeCategory, setActiveCategory] = useState('all')
  const description = getTextValue(content?.description, t('gameNews.description'))
  const descriptionSecondLine = getTextValue(content?.descriptionSecondLine, t('gameNews.descriptionSecondLine'))
  const visibleArticles = useMemo(
    () => activeCategory === 'all' ? ARTICLES : ARTICLES.filter(article => article.category === activeCategory),
    [activeCategory]
  )
  const featured = ARTICLES[0]

  return (
    <main className="min-h-screen rounded-tl-[8px] rounded-tr-[8px] bg-white text-slate-950 shadow dark:bg-gray-950 dark:text-white">
      <SEO
        title={getTextValue(content?.seo?.title, t('gameNews.seo.title'))}
        description={getTextValue(content?.seo?.description, `${description} ${descriptionSecondLine}`.trim())}
        url="https://smartmall.site/game-news"
      />

      <section className="bg-slate-950 px-4 py-5 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ClientBreadcrumb
            className="mb-6 text-slate-300"
            label={t('gameNews.breadcrumb.label')}
            items={[
              { label: t('gameNews.breadcrumb.home'), to: '/' },
              { label: t('gameNews.breadcrumb.current') }
            ]}
          />

          <div className="grid gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-4 py-2 text-sm font-bold text-indigo-100">
                <Newspaper className="h-4 w-4" aria-hidden="true" />
                {getTextValue(content?.status, t('gameNews.status'))}
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {getTextValue(content?.title, t('gameNews.title'))}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                {description} {descriptionSecondLine}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/blog" className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-600">
                  {t('gameNews.hero.primaryAction')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link to="/flash-sale" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15">
                  {t('gameNews.hero.secondaryAction')}
                </Link>
              </div>
            </div>

            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <div className={`flex min-h-[220px] items-end rounded-[1.5rem] bg-gradient-to-br ${featured.image} p-6`}>
                <div>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                    {t('gameNews.featured')}
                  </span>
                  <h2 className="mt-4 text-2xl font-black">{t(featured.title)}</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">{t(featured.excerpt)}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-600">{t('gameNews.latest.eyebrow')}</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">{t('gameNews.latest.title')}</h2>
              <p className="mt-3 max-w-2xl text-slate-600 dark:text-gray-300">{t('gameNews.latest.description')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${activeCategory === category
                    ? 'border-indigo-500 bg-indigo-500 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'}`}
                >
                  {t(`gameNews.categories.${category}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-5 md:grid-cols-2">
              {visibleArticles.map(article => (
                <article key={article.key} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className={`h-40 bg-gradient-to-br ${article.image}`} />
                  <div className="p-5">
                    <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{t(article.date)}</span>
                      <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{t(article.readTime)}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-black">{t(article.title)}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-300">{t(article.excerpt)}</p>
                    <Link to="/blog" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300">
                      {t('gameNews.latest.readMore')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <aside className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <h2 className="font-black">{t('gameNews.trendingTitle')}</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {TRENDING.map(item => (
                    <Link key={item} to="/blog" className="block rounded-2xl bg-white p-4 text-sm font-semibold text-slate-700 transition hover:text-indigo-600 dark:bg-gray-950 dark:text-gray-200 dark:hover:text-indigo-300">
                      {t(item)}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-indigo-600 p-5 text-white">
                <Search className="h-7 w-7" />
                <h2 className="mt-4 text-xl font-black">{t('gameNews.newsletter.title')}</h2>
                <p className="mt-2 text-sm leading-6 text-indigo-100">{t('gameNews.newsletter.description')}</p>
                <Link to="/blog" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-indigo-700">
                  {t('gameNews.newsletter.button')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-4 py-14 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-7 shadow-sm dark:bg-gray-950 md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300">
              <Tags className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">{t('gameNews.cta.eyebrow')}</span>
            </div>
            <h2 className="mt-3 text-2xl font-black">{t('gameNews.cta.title')}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-gray-300">{t('gameNews.cta.description')}</p>
          </div>
          <Link to="/blog" className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-slate-950 md:mt-0">
            {t('gameNews.cta.button')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
