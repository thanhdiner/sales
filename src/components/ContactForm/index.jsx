import React, { useMemo, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { message, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { sendContactForm } from '@/services/contactService'

const SUBJECT_OPTION_KEYS = [
  { value: 'product', labelKey: 'contactForm.subjects.product' },
  { value: 'order', labelKey: 'contactForm.subjects.order' },
  { value: 'support', labelKey: 'contactForm.subjects.support' },
  { value: 'partnership', labelKey: 'contactForm.subjects.partnership' },
  { value: 'other', labelKey: 'contactForm.subjects.other' }
]

const ContactForm = () => {
  const { t } = useTranslation('clientContact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const subjectOptions = useMemo(
    () =>
      SUBJECT_OPTION_KEYS.map(option => ({
        value: option.value,
        label: t(option.labelKey)
      })),
    [t]
  )

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubjectChange = value => {
    setFormData(prev => ({ ...prev, subject: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.email || !formData.message || !formData.subject) {
      message.error(t('contactForm.validation.required'))
      return
    }

    setIsSubmitting(true)

    try {
      await sendContactForm(formData)
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      message.success(t('contactForm.message.success'))
    } catch (err) {
      message.error(err.message || t('contactForm.message.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-form-card rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-7">
      <div className="mb-6">
        <h3 className="contact-card-title text-xl font-semibold text-gray-900 dark:text-gray-100">{t('contactForm.title')}</h3>

        <p className="contact-form-help mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{t('contactForm.description')}</p>
      </div>

      {submitted ? (
        <div className="contact-form-success rounded-xl border border-gray-200 bg-gray-50 px-5 py-10 text-center dark:border-gray-700 dark:bg-gray-900/30">
          <div className="contact-success-icon mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-green-600 shadow-sm dark:bg-gray-800">
            <CheckCircle className="h-6 w-6" />
          </div>

          <h4 className="contact-card-title mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('contactForm.successTitle')}
          </h4>

          <p className="contact-form-help text-sm leading-6 text-gray-600 dark:text-gray-300">{t('contactForm.successDescription')}</p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="contact-form-label mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                {t('contactForm.fields.name')}
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="contact-input w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-400"
                placeholder={t('contactForm.fields.namePlaceholder')}
              />
            </div>

            <div>
              <label className="contact-form-label mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                {t('contactForm.fields.email')}
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="contact-input w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-400"
                placeholder={t('contactForm.fields.emailPlaceholder')}
              />
            </div>
          </div>

          <div>
            <label className="contact-form-label mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              {t('contactForm.fields.subject')}
            </label>

            <Select
              name="subject"
              value={formData.subject || undefined}
              onChange={handleSubjectChange}
              placeholder={t('contactForm.fields.subjectPlaceholder')}
              className="contact-subject-select w-full"
              popupClassName="contact-subject-select-dropdown"
              size="large"
              options={subjectOptions}
              allowClear
            />
          </div>

          <div>
            <label className="contact-form-label mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              {t('contactForm.fields.message')}
            </label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="contact-input w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-400"
              placeholder={t('contactForm.fields.messagePlaceholder')}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="contact-submit-button w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
          >
            {isSubmitting ? t('contactForm.submitting') : t('contactForm.submit')}
          </button>
        </form>
      )}
    </div>
  )
}

export default ContactForm
