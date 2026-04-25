import { Card } from 'antd'
import SEO from '@/components/SEO'
import { useAdminBannerForm } from './hooks/useAdminBannerForm'
import { useAdminBannersData } from './hooks/useAdminBannersData'
import AdminBannerFormModal from './sections/AdminBannerFormModal'
import AdminBannersHeaderSection from './sections/AdminBannersHeaderSection'
import AdminBannersTableSection from './sections/AdminBannersTableSection'
import './AdminBannersPage.scss'

export default function AdminBannersPage() {
  const { banners, loading, fetchBanners, handleDeleteBanner } = useAdminBannersData()
  const bannerForm = useAdminBannerForm({ onSaved: fetchBanners })

  return (
    <div className="admin-banners-page min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-6">
      <SEO title="Admin - Banners" noIndex />

      <Card className="admin-banners-card rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)]">
        <AdminBannersHeaderSection onCreateBanner={() => bannerForm.openModal()} />

        <AdminBannersTableSection
          banners={banners}
          loading={loading}
          onEditBanner={bannerForm.openModal}
          onDeleteBanner={handleDeleteBanner}
        />
      </Card>

      <AdminBannerFormModal {...bannerForm} />
    </div>
  )
}
