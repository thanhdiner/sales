import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import { deleteAdminPermission, getAdminPermissions } from '@/services/permissionService'
import { getPermissionErrorMessage } from '../utils'

export function useAdminPermissionsData() {
  const [permissionList, setPermissionList] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchPermissions = useCallback(async () => {
    setLoading(true)

    try {
      const res = await getAdminPermissions()
      setPermissionList(res.data || [])
    } catch {
      message.error('Không thể tải danh sách quyền')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  const handleDeletePermission = async permissionId => {
    setLoading(true)

    try {
      await deleteAdminPermission(permissionId)
      message.success('Đã xóa quyền')
      await fetchPermissions()
    } catch (error) {
      message.error(getPermissionErrorMessage(error, 'Không thể xóa quyền'))
    } finally {
      setLoading(false)
    }
  }

  return {
    permissionList,
    loading,
    fetchPermissions,
    handleDeletePermission
  }
}
