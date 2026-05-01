import { Form } from 'antd'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import useProfile from './hooks/useProfile'
import ProfileActions from './sections/ProfileActions'
import ProfileAvatar from './sections/ProfileAvatar'
import ProfileFields from './sections/ProfileFields'
import ProfileHeader from './sections/ProfileHeader'
import ProfileLoading from './sections/ProfileLoading'

export default function Profile() {
  const { t, i18n } = useTranslation('adminProfile')
  const language = i18n.resolvedLanguage || i18n.language
  const {
    profile,
    form,
    loading,
    inputRef,
    avatarPreview,
    roleLabel,
    statusLabel,
    lastLoginLabel,
    initialLetterAvatar,
    handleFileChange,
    handleRemoveAvatar,
    handleReset,
    handleSave
  } = useProfile({ language, t })

  if (!profile) {
    return <ProfileLoading t={t} />
  }

  return (
    <div className="mx-auto max-w-[1200px] rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-8 shadow-[var(--admin-shadow)]">
      <SEO title={t('seo.title')} noIndex />

      <ProfileHeader t={t} />

      <Form form={form} layout="vertical" onFinish={handleSave}>
        <ProfileAvatar
          avatarPreview={avatarPreview}
          initialLetterAvatar={initialLetterAvatar}
          inputRef={inputRef}
          onFileChange={handleFileChange}
          onRemove={handleRemoveAvatar}
          t={t}
        />

        <ProfileFields loading={loading} roleLabel={roleLabel} statusLabel={statusLabel} lastLoginLabel={lastLoginLabel} t={t} />

        <ProfileActions loading={loading} onCancel={handleReset} t={t} />
      </Form>
    </div>
  )
}
