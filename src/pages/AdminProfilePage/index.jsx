import { Form } from 'antd'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import useAdminProfilePage from './hooks/useAdminProfilePage'
import AdminProfileActionsSection from './sections/AdminProfileActionsSection'
import AdminProfileAvatarSection from './sections/AdminProfileAvatarSection'
import AdminProfileFieldsSection from './sections/AdminProfileFieldsSection'
import AdminProfileHeaderSection from './sections/AdminProfileHeaderSection'
import AdminProfileLoadingState from './sections/AdminProfileLoadingState'

export default function AdminProfilePage() {
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
  } = useAdminProfilePage({ language, t })

  if (!profile) {
    return <AdminProfileLoadingState t={t} />
  }

  return (
    <div className="mx-auto max-w-[1200px] rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-8 shadow-[var(--admin-shadow)]">
      <SEO title={t('seo.title')} noIndex />

      <AdminProfileHeaderSection t={t} />

      <Form form={form} layout="vertical" onFinish={handleSave}>
        <AdminProfileAvatarSection
          avatarPreview={avatarPreview}
          initialLetterAvatar={initialLetterAvatar}
          inputRef={inputRef}
          onFileChange={handleFileChange}
          onRemove={handleRemoveAvatar}
          t={t}
        />

        <AdminProfileFieldsSection
          loading={loading}
          roleLabel={roleLabel}
          statusLabel={statusLabel}
          lastLoginLabel={lastLoginLabel}
          t={t}
        />

        <AdminProfileActionsSection loading={loading} onCancel={handleReset} t={t} />
      </Form>
    </div>
  )
}
