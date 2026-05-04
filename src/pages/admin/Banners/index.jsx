import { useTranslation } from 'react-i18next'
import { PageShell } from '@/components/admin/ui'
import { useBannerForm } from './hooks/useBannerForm'
import { useBannersData } from './hooks/useBannersData'
import BannerFormModal from './sections/BannerFormModal'
import BannersHeader from './sections/BannersHeader'
import BannersTable from './sections/BannersTable'
import './index.scss'

export default function Banners() {
  const { t } = useTranslation('adminBanners')
  const { banners, loading, fetchBanners, handleDeleteBanner } = useBannersData()
  const bannerForm = useBannerForm({ onSaved: fetchBanners })

  return (
    <>
      <PageShell
        seoTitle={t('seo.title')}
        className="admin-banners-page"
      >
        <BannersHeader onCreateBanner={() => bannerForm.openModal()} />

        <BannersTable
          banners={banners}
          loading={loading}
          onEditBanner={bannerForm.openModal}
          onDeleteBanner={handleDeleteBanner}
        />
      </PageShell>

      <BannerFormModal {...bannerForm} />
    </>
  )
}
