import { Card } from 'antd'
import SEO from '@/components/SEO'
import { useAdminBannerForm } from './hooks/useAdminBannerForm'
import { useAdminBannersData } from './hooks/useAdminBannersData'
import AdminBannerFormModal from './sections/AdminBannerFormModal'
import AdminBannersHeaderSection from './sections/AdminBannersHeaderSection'
import AdminBannersTableSection from './sections/AdminBannersTableSection'

export default function AdminBannersPage() {
  const { banners, loading, fetchBanners, handleDeleteBanner } = useAdminBannersData()
  const bannerForm = useAdminBannerForm({ onSaved: fetchBanners })

  return (
    <div className="min-h-screen rounded-xl bg-slate-50 p-6 dark:bg-gray-900">
      <SEO title="Admin - Banners" noIndex />

      <Card className="rounded-xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
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
