import { useCallback, useEffect, useState } from 'react'
import { Modal, message } from 'antd'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { deleteBannerById, getBanners } from '@/services/adminBannersService'
import { normalizeBannerActiveValue } from '../utils'

export function useAdminBannersData() {
  const { t } = useTranslation('adminBanners')
  const language = useCurrentLanguage()
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchBanners = useCallback(async () => {
    setLoading(true)

    try {
      const res = await getBanners()
      setBanners(
        (res.data || []).map(banner => ({
          ...banner,
          isActive: normalizeBannerActiveValue(banner.isActive)
        }))
      )
    } catch {
      message.error(t('messages.fetchError'))
    } finally {
      setLoading(false)
    }
  }, [language, t])

  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  const handleDeleteBanner = bannerId => {
    Modal.confirm({
      className: 'admin-banners-confirm-modal',
      rootClassName: 'admin-banners-confirm-modal',
      title: t('messages.deleteConfirmTitle'),
      content: t('messages.deleteConfirmContent'),
      okText: t('common.delete'),
      cancelText: t('common.cancel'),
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteBannerById(bannerId)
          message.success(t('messages.deleteSuccess'))
          fetchBanners()
        } catch {
          message.error(t('messages.deleteError'))
        }
      }
    })
  }

  return {
    banners,
    loading,
    fetchBanners,
    handleDeleteBanner
  }
}
