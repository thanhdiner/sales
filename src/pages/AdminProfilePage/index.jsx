import { Form } from 'antd'
import SEO from '@/components/SEO'
import useAdminProfilePage from './hooks/useAdminProfilePage'
import AdminProfileActionsSection from './sections/AdminProfileActionsSection'
import AdminProfileAvatarSection from './sections/AdminProfileAvatarSection'
import AdminProfileFieldsSection from './sections/AdminProfileFieldsSection'
import AdminProfileHeaderSection from './sections/AdminProfileHeaderSection'
import AdminProfileLoadingState from './sections/AdminProfileLoadingState'

export default function AdminProfilePage() {
  const {
    profile,
    form,
    loading,
    inputRef,
    avatarPreview,
    roleLabel,
    lastLoginLabel,
    initialLetterAvatar,
    handleFileChange,
    handleRemoveAvatar,
    handleReset,
    handleSave
  } = useAdminProfilePage()

  if (!profile) {
    return <AdminProfileLoadingState />
  }

  return (
    <div className="mx-auto max-w-[1200px] rounded-lg bg-white p-8 shadow-[0_2px_16px_rgba(0,_0,_0,_0.01)] dark:bg-gray-800">
      <SEO title="Admin – Hồ sơ" noIndex />

      <AdminProfileHeaderSection />

      <Form form={form} layout="vertical" onFinish={handleSave}>
        <AdminProfileAvatarSection
          avatarPreview={avatarPreview}
          initialLetterAvatar={initialLetterAvatar}
          inputRef={inputRef}
          onFileChange={handleFileChange}
          onRemove={handleRemoveAvatar}
        />

        <AdminProfileFieldsSection
          loading={loading}
          roleLabel={roleLabel}
          lastLoginLabel={lastLoginLabel}
        />

        <AdminProfileActionsSection loading={loading} onCancel={handleReset} />
      </Form>
    </div>
  )
}
