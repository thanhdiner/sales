import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, BadgeCheck, Boxes, Clock3, Crown, Gift, Handshake, PackageCheck, Sparkles, WandSparkles } from 'lucide-react'
import ClientBreadcrumb from '@/components/client/Breadcrumb'
import SEO from '@/components/shared/SEO'
import { getSpecialPackageContent } from './content'

const PACKAGE_ICONS = [Crown, Gift, Boxes]
const WORKFLOW_ICONS = [Handshake, WandSparkles, PackageCheck]
const BENEFIT_ICONS = [BadgeCheck, Clock3, Sparkles]

export default function SpecialPackageComingSoon() {
  const { t, i18n } = useTranslation('clientComingSoon')
  const navigate = useNavigate()
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const language = i18n.resolvedLanguage || i18n.language
  const content = useMemo(
    () => getSpecialPackageContent({ websiteConfig, language, t }),
    [websiteConfig, language, t]
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
    <main className="min-h-screen rounded-tl-[8px] rounded-tr-[8px] bg-white text-slate-950 shadow dark:bg-gray-950 dark:text-white">
      <SEO title={content.seo.title} description={content.seo.description} url="https://smartmall.site/special-package" noIndex={content.noIndex} />

      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-5 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 sm:px-6 lg:px-8">
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <ClientBreadcrumb
            className="mb-6"
            label={t('specialPackage.breadcrumb.label')}
            items={[
              { label: t('specialPackage.breadcrumb.home'), to: '/' },
              { label: t('specialPackage.breadcrumb.current') }
            ]}
          />

          <div className="grid gap-10 py-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700 dark:bg-orange-400/10 dark:text-orange-300">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {content.eyebrow}
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                {content.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-gray-300 sm:text-lg">
                {content.description}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openSupport(t('specialPackage.hero.supportMessage'))}
                  className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
                >
                  {t('specialPackage.hero.primaryAction')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/shopping-guide')}
                  className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-6 py-3 text-sm font-bold text-orange-700 transition hover:border-orange-300 hover:bg-orange-50 dark:border-orange-400/20 dark:bg-white/5 dark:text-orange-200 dark:hover:bg-white/10"
                >
                  {t('specialPackage.hero.secondaryAction')}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-orange-100 bg-white p-5 shadow-2xl shadow-orange-500/10 dark:border-white/10 dark:bg-white/5">
              <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white dark:bg-gray-900">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-300">{t('specialPackage.hero.previewEyebrow')}</p>
                <h2 className="mt-2 text-2xl font-black">{t('specialPackage.hero.previewTitle')}</h2>
                <div className="mt-6 space-y-3">
                  {[0, 1, 2].map(index => {
                    const Icon = PACKAGE_ICONS[index]
                    return (
                      <div key={t(`specialPackage.packages.${index}.title`)} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                        <Icon className="mt-1 h-5 w-5 text-orange-300" aria-hidden="true" />
                        <div>
                          <h3 className="font-bold">{t(`specialPackage.packages.${index}.title`)}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-300">{t(`specialPackage.packages.${index}.description`)}</p>
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
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-600">{t('specialPackage.packagesEyebrow')}</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">{t('specialPackage.packagesTitle')}</h2>
            <p className="mt-3 text-slate-600 dark:text-gray-300">{t('specialPackage.packagesDescription')}</p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {[0, 1, 2].map(index => {
              const Icon = PACKAGE_ICONS[index]
              return (
                <article key={t(`specialPackage.packages.${index}.title`)} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 dark:bg-orange-400/10 dark:text-orange-300">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-black">{t(`specialPackage.packages.${index}.title`)}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-300">{t(`specialPackage.packages.${index}.description`)}</p>
                  <ul className="mt-5 space-y-2">
                    {[0, 1, 2].map(featureIndex => (
                      <li key={t(`specialPackage.packages.${index}.features.${featureIndex}`)} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-gray-200">
                        <BadgeCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                        {t(`specialPackage.packages.${index}.features.${featureIndex}`)}
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-4 py-14 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-600">{t('specialPackage.workflow.eyebrow')}</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">{t('specialPackage.workflow.title')}</h2>
            <p className="mt-3 text-slate-600 dark:text-gray-300">{content.note}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map(index => {
              const Icon = WORKFLOW_ICONS[index]
              return (
                <div key={t(`specialPackage.workflow.steps.${index}.title`)} className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-950">
                  <Icon className="h-7 w-7 text-orange-500" aria-hidden="true" />
                  <p className="mt-5 text-sm font-black text-slate-400">0{index + 1}</p>
                  <h3 className="mt-2 font-black">{t(`specialPackage.workflow.steps.${index}.title`)}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-300">{t(`specialPackage.workflow.steps.${index}.description`)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-950 p-7 text-white md:p-10 dark:bg-gray-900">
          <div className="grid gap-6 md:grid-cols-3">
            {BENEFIT_ICONS.map((Icon, index) => (
              <div key={t(`specialPackage.benefits.${index}.title`)}>
                <Icon className="h-7 w-7 text-orange-300" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-black">{t(`specialPackage.benefits.${index}.title`)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{t(`specialPackage.benefits.${index}.description`)}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <h2 className="text-2xl font-black">{t('specialPackage.cta.title')}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{t('specialPackage.cta.description')}</p>
            </div>
            <button type="button" onClick={() => navigate('/contact')} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-orange-100 md:mt-0">
              {t('specialPackage.cta.button')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
