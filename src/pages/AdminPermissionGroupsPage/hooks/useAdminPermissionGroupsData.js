import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import {
  deleteAdminPermissionGroup,
  getAdminPermissionGroups,
  toggleAdminPermissionGroupActive
} from '@/services/permissionGroupsService'
import { getPermissionGroupErrorMessage } from '../utils'

export function useAdminPermissionGroupsData() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchGroups = useCallback(async () => {
    setLoading(true)

    try {
      const res = await getAdminPermissionGroups()
      setGroups(res.data || [])
    } catch {
      message.error('Không thể tải nhóm quyền')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  const handleDeleteGroup = async groupId => {
    setLoading(true)

    try {
      await deleteAdminPermissionGroup(groupId)
      message.success('Đã xóa nhóm quyền')
      await fetchGroups()
    } catch (error) {
      message.error(getPermissionGroupErrorMessage(error, 'Không thể xóa nhóm quyền'))
    } finally {
      setLoading(false)
    }
  }

  const handleToggleGroupActive = async group => {
    setUpdatingId(group._id)

    try {
      await toggleAdminPermissionGroupActive(group._id, !group.isActive)
      message.success(`${!group.isActive ? 'Đã kích hoạt' : 'Đã tạm dừng'} nhóm quyền`)
      await fetchGroups()
    } catch (error) {
      message.error(getPermissionGroupErrorMessage(error, 'Không thể thay đổi trạng thái'))
    } finally {
      setUpdatingId(null)
    }
  }

  return {
    groups,
    loading,
    updatingId,
    fetchGroups,
    handleDeleteGroup,
    handleToggleGroupActive
  }
}
