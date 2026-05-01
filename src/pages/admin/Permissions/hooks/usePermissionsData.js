import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import { deletePermission, getPermissions } from '@/services/admin/rbac/permission'
import { getPermissionErrorMessage } from '../utils'

export function usePermissionsData({ t = key => key } = {}) {
  const [permissionList, setPermissionList] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchPermissions = useCallback(async () => {
    setLoading(true)

    try {
      const res = await getPermissions()
      setPermissionList(res.data || [])
    } catch {
      message.error(t('messages.fetchError'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  const handleDeletePermission = useCallback(
    async permissionId => {
      setLoading(true)

      try {
        await deletePermission(permissionId)
        message.success(t('messages.deleteSuccess'))
        await fetchPermissions()
      } catch (error) {
        message.error(getPermissionErrorMessage(error, t('messages.deleteError')))
      } finally {
        setLoading(false)
      }
    },
    [fetchPermissions, t]
  )

  return {
    permissionList,
    loading,
    fetchPermissions,
    handleDeletePermission
  }
}
