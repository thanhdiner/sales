import React, { useState } from 'react'
import { message as antdMessage } from 'antd'
import { changePassword } from '@/services/client/auth/user'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { setDarkMode } from '@/stores/app/darkModeSlice'
import { setLanguage } from '@/stores/app/languageSlice'
import MobileBackButton from '@/components/shared/MobileBackButton'
import PasswordInput from '@/components/shared/PasswordInput'
import SEO from '@/components/shared/SEO'

export default function Settings() {
  const { t } = useTranslation('clientSettings')
  const hasPassword = useSelector(state => state.clientUser.user?.hasPassword)
  const darkMode = useSelector(state => state.darkMode.value)
  const language = useSelector(state => state.language?.value || 'vi')
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const validatePassword = password => {
    const minLength = password.length >= 6
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)

    return { minLength, hasUpper, hasLower, hasNumber }
  }

  const handlePasswordChange = async e => {
    e.preventDefault()

    const { currentPassword, newPassword, confirmPassword } = formData

    if (hasPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        antdMessage.error(t('validation.required'))
        return
      }
    } else if (!newPassword || !confirmPassword) {
      antdMessage.error(t('validation.required'))
      return
    }

    if (newPassword !== confirmPassword) {
      antdMessage.error(t('validation.confirmMismatch'))
      return
    }

    const validation = validatePassword(newPassword)
    if (!validation.minLength || !validation.hasUpper || !validation.hasLower || !validation.hasNumber) {
      antdMessage.error(t('validation.weakPassword'))
      return
    }

    setLoading(true)

    try {
      if (hasPassword) {
        await changePassword({ currentPassword, newPassword })
      } else {
        await changePassword({ newPassword })
      }

      antdMessage.success(t('validation.success'))
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      antdMessage.error(err?.response?.message || err?.message || t('validation.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const togglePasswordVisibility = field => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const passwordValidation = validatePassword(formData.newPassword)

  const passwordRules = [
    { label: t('rules.minLength'), valid: passwordValidation.minLength },
    { label: t('rules.uppercase'), valid: passwordValidation.hasUpper },
    { label: t('rules.lowercase'), valid: passwordValidation.hasLower },
    { label: t('rules.number'), valid: passwordValidation.hasNumber }
  ]

  const securityTips = t('security.tips', { returnObjects: true })

  const currentModeLabel = darkMode ? t('appearance.dark') : t('appearance.light')
  const currentLanguageLabel = language === 'vi' ? t('language.vi') : t('language.en')

  return (
    <div className="min-h-screen bg-white px-4 py-12 dark:bg-gray-900 md:px-8">
      <SEO title={t('seoTitle')} noIndex />

      <div className="mx-auto max-w-2xl">
        <MobileBackButton label={t('back')} />

        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">{t('eyebrow')}</p>

          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">{t('title')}</h1>

          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-gray-600 dark:text-gray-300">{t('description')}</p>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
          <div className="flex items-center justify-between gap-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('appearance.title')}</h2>

              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {t('appearance.currentMode', { mode: currentModeLabel })}
              </p>
            </div>

            <button
              type="button"
              onClick={() => dispatch(setDarkMode(!darkMode))}
              className={`relative h-7 w-12 rounded-full border transition-colors ${
                darkMode ? 'border-white/10 bg-[#202327] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]' : 'border-gray-300 bg-gray-300'
              }`}
              aria-pressed={darkMode}
              aria-label={t('appearance.toggleLabel')}
            >
              <span
                className={`absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full shadow-sm transition-transform ${
                  darkMode ? 'translate-x-5 bg-[#22c55e]' : 'translate-x-0 bg-white'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('language.title')}</h2>

              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">{t('language.description')}</p>

              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                {t('language.current', { language: currentLanguageLabel })}
              </p>
            </div>

            <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-900/40">
              <button
                type="button"
                onClick={() => dispatch(setLanguage('vi'))}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  language === 'vi'
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                    : 'text-gray-600 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                VI
              </button>

              <button
                type="button"
                onClick={() => dispatch(setLanguage('en'))}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  language === 'en'
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                    : 'text-gray-600 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {hasPassword ? t('password.changeTitle') : t('password.setupTitle')}
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {hasPassword ? t('password.changeDescription') : t('password.setupDescription')}
            </p>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-5">
            {hasPassword && (
              <PasswordInput
                label={t('password.currentPassword')}
                showPassword={showPasswords.current}
                value={formData.currentPassword}
                onChange={e => handleInputChange('currentPassword', e.target.value)}
                onToggleVisibility={() => togglePasswordVisibility('current')}
                placeholder={t('password.currentPlaceholder')}
                autoComplete="current-password"
                toggleLabel={t('password.showCurrentLabel')}
              />
            )}

            <div>
              <PasswordInput
                label={t('password.newPassword')}
                showPassword={showPasswords.new}
                value={formData.newPassword}
                onChange={e => handleInputChange('newPassword', e.target.value)}
                onToggleVisibility={() => togglePasswordVisibility('new')}
                placeholder={t('password.newPlaceholder')}
                autoComplete="new-password"
                toggleLabel={t('password.showNewLabel')}
              />

              {formData.newPassword && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {passwordRules.map(rule => (
                    <div
                      key={rule.label}
                      className={`rounded-lg border px-3 py-2 text-xs ${
                        rule.valid
                          ? 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                          : 'border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
                      }`}
                    >
                      {rule.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <PasswordInput
                label={t('password.confirmPassword')}
                showPassword={showPasswords.confirm}
                value={formData.confirmPassword}
                onChange={e => handleInputChange('confirmPassword', e.target.value)}
                onToggleVisibility={() => togglePasswordVisibility('confirm')}
                placeholder={t('password.confirmPlaceholder')}
                autoComplete="new-password"
                toggleLabel={t('password.showConfirmLabel')}
              />

              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t('password.confirmMismatch')}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
              >
                {loading ? t('password.processing') : hasPassword ? t('password.changeButton') : t('password.setupButton')}
              </button>

              <button
                type="button"
                onClick={() => setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                className="rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                {t('password.cancel')}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('security.title')}</h2>

            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">{t('security.description')}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {securityTips.map((tip, index) => (
              <div
                key={tip}
                className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  {index + 1}
                </span>

                <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
