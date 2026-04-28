import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/ui'
import { useAdminBannerForm } from './hooks/useAdminBannerForm'
import { useAdminBannersData } from './hooks/useAdminBannersData'
import AdminBannerFormModal from './sections/AdminBannerFormModal'
import AdminBannersHeaderSection from './sections/AdminBannersHeaderSection'
import AdminBannersTableSection from './sections/AdminBannersTableSection'
import './AdminBannersPage.scss'

export default function AdminBannersPage() {
  const { t } = useTranslation('adminBanners')
  const { banners, loading, fetchBanners, handleDeleteBanner } = useAdminBannersData()
  const bannerForm = useAdminBannerForm({ onSaved: fetchBanners })

  return (
    <>
      <AdminPageShell
        seoTitle={t('seo.title')}
        className="admin-banners-page"
        panel
        panelClassName="admin-banners-card"
      >
        <AdminBannersHeaderSection onCreateBanner={() => bannerForm.openModal()} />

        <AdminBannersTableSection
          banners={banners}
          loading={loading}
          onEditBanner={bannerForm.openModal}
          onDeleteBanner={handleDeleteBanner}
        />
      </AdminPageShell>

      <AdminBannerFormModal {...bannerForm} />
    </>
  )
}
