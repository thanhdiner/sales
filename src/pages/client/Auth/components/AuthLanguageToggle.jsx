import { GlobalOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { setLanguage } from '@/stores/app/languageSlice'

export default function AuthLanguageToggle({ colors }) {
  const dispatch = useDispatch()
  const { t } = useTranslation('common')
  const language = useSelector(state => state.language?.value || 'vi')
  const nextLanguage = language === 'vi' ? 'en' : 'vi'

  return (
    <button
      type="button"
      className="sovereign-auth-language-toggle"
      aria-label={t('language.label')}
      onClick={() => dispatch(setLanguage(nextLanguage))}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        minWidth: '4.75rem',
        justifyContent: 'center',
        color: colors.onSurfaceVariant,
        padding: '0.35rem 0.75rem',
        borderRadius: '0.75rem',
        cursor: 'pointer',
        fontSize: '0.8125rem',
        fontWeight: 700,
        border: `1px solid ${colors.outlineVariant}`,
        background: colors.surfaceContainerLow,
        transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease'
      }}
      onMouseEnter={event => {
        event.currentTarget.style.background = colors.surfaceContainerHigh
        event.currentTarget.style.color = colors.onSurface
        event.currentTarget.style.borderColor = colors.outline
      }}
      onMouseLeave={event => {
        event.currentTarget.style.background = colors.surfaceContainerLow
        event.currentTarget.style.color = colors.onSurfaceVariant
        event.currentTarget.style.borderColor = colors.outlineVariant
      }}
    >
      <GlobalOutlined />
      <span>{language === 'vi' ? 'VI' : 'EN'}</span>
    </button>
  )
}
