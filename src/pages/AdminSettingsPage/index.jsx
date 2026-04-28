import { Globe2, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import SEO from '@/components/SEO'
import AdminSecurityTab from './components/AdminSecurityTab'
import AdminWebsiteConfigTab from './components/AdminWebsiteConfigTab'

const SETTING_TABS = [
  {
    key: 'security',
    labelKey: 'tabs.security.label',
    descriptionKey: 'tabs.security.description',
    Icon: ShieldCheck
  },
  {
    key: 'configuration',
    labelKey: 'tabs.configuration.label',
    descriptionKey: 'tabs.configuration.description',
    Icon: Globe2
  }
]

const SECURITY_URL_PARAMS = ['twofa', 'twofaStep']

const AdminSettingsPage = () => {
  const { t } = useTranslation('adminSettings')
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('setting') || 'security'

  const handleTabChange = key => {
    const params = new URLSearchParams(searchParams)
    params.set('setting', key)

    if (key !== 'security') {
      SECURITY_URL_PARAMS.forEach(param => params.delete(param))
    }

    setSearchParams(params, { replace: true })
  }

  return (
    <div className="min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-4 sm:p-5 lg:p-6">
      <SEO title={t('seo.title')} noIndex />

      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-col gap-4 border-b border-[var(--admin-border)] pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--admin-accent)]">
              {t('page.eyebrow')}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--admin-text)]">
              {t('page.title')}
            </h1>
            <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
              {t('page.description')}
            </p>
          </div>

          <div className="grid gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-1.5 shadow-[var(--admin-shadow)] sm:grid-cols-2">
            {SETTING_TABS.map(({ key, labelKey, descriptionKey, Icon }) => {
              const active = activeTab === key
              const label = t(labelKey)
              const description = t(descriptionKey)

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTabChange(key)}
                  className={`flex min-h-[64px] items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                    active
                      ? 'bg-[var(--admin-accent)] text-white shadow-sm'
                      : 'text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      active
                        ? 'bg-white/15 text-white'
                        : 'bg-[var(--admin-surface-2)] text-[var(--admin-text-subtle)]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className={`mt-0.5 block text-xs ${active ? 'text-blue-100' : 'text-[var(--admin-text-subtle)]'}`}>
                      {description}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {activeTab === 'configuration' ? <AdminWebsiteConfigTab /> : <AdminSecurityTab />}
      </div>
    </div>
  )
}

export default AdminSettingsPage
