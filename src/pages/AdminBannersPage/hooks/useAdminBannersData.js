import { useCallback, useEffect, useState } from 'react'
import { Modal, message } from 'antd'
import { deleteBannerById, getBanners } from '@/services/adminBannersService'
import { normalizeBannerActiveValue } from '../utils'

export function useAdminBannersData() {
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
      message.error('Không thể tải danh sách banner')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  const handleDeleteBanner = bannerId => {
    Modal.confirm({
      title: 'Xác nhận xóa banner',
      content: 'Bạn có chắc chắn muốn xóa banner này không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteBannerById(bannerId)
          message.success('Đã xóa banner')
          fetchBanners()
        } catch {
          message.error('Không thể xóa banner')
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
