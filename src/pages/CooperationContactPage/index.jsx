import SEO from '@/components/SEO'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import '../Contact/Contact.scss'
import { useCooperationContactContent } from './useCooperationContactContent'

const getTextValue = (value, fallback = '') => {
  if (typeof value !== 'string') return fallback

  const normalizedValue = value.trim()

  return normalizedValue && normalizedValue !== '[object Object]' ? value : fallback
}

const CooperationContactPage = () => {
  const { t } = useTranslation('clientContact')
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const { data: content } = useCooperationContactContent()

  const email = getTextValue(content?.email, websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com')
  const phone = getTextValue(content?.phone, websiteConfig?.contactInfo?.phone || '0823387108')

  return (
    <div className="contact-themed min-h-[70vh] bg-white px-4 py-12 dark:bg-gray-900">
      <SEO
        title={getTextValue(content?.seo?.title, t('cooperationPage.seo.title'))}
        description={getTextValue(content?.seo?.description, t('cooperationPage.seo.description'))}
      />

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <p className="contact-section-eyebrow mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            {getTextValue(content?.eyebrow, t('cooperationPage.eyebrow'))}
          </p>

          <h1 className="contact-title text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
            {getTextValue(content?.title, t('cooperationPage.title'))}
          </h1>

          <p className="contact-description mx-auto mt-4 max-w-xl text-base leading-7 text-gray-600 dark:text-gray-300">
            {getTextValue(content?.description, t('cooperationPage.description'))}
          </p>
        </div>

        <div className="contact-card rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
          <div className="space-y-4">
            <div className="contact-muted-box rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
              <p className="contact-card-title text-sm font-semibold text-gray-900 dark:text-gray-100">
                {getTextValue(content?.emailLabel, t('cooperationPage.emailLabel'))}
              </p>

              <a
                href={`mailto:${email}`}
                className="contact-muted-text mt-2 block break-all text-sm leading-6 text-gray-600 underline underline-offset-4 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                {email}
              </a>
            </div>

            <div className="contact-muted-box rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
              <p className="contact-card-title text-sm font-semibold text-gray-900 dark:text-gray-100">
                {getTextValue(content?.phoneLabel, t('cooperationPage.phoneLabel'))}
              </p>

              <a
                href={`tel:${phone}`}
                className="contact-muted-text mt-2 block text-sm leading-6 text-gray-600 underline underline-offset-4 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                {phone}
              </a>
            </div>
          </div>

          <div className="contact-card-row mt-6 rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="contact-muted-text mb-0 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {getTextValue(content?.note, t('cooperationPage.note'))}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CooperationContactPage
