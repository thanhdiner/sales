import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  deleteAdminPermissionGroup,
  getAdminPermissionGroups,
  toggleAdminPermissionGroupActive
} from '@/services/permissionGroupsService'
import { getAdminPermissions } from '@/services/permissionService'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { getPermissionGroupErrorMessage } from '../utils'

function attachPermissionCounts(groups = [], permissions = []) {
  if (!permissions.length) {
    return groups
  }

  const countByGroup = permissions.reduce((counts, permission) => {
    if (!permission?.group || permission.deleted) {
      return counts
    }

    counts[permission.group] = (counts[permission.group] || 0) + 1
    return counts
  }, {})

  return groups.map(group => ({
    ...group,
    permissionCount: countByGroup[group.value] || 0
  }))
}

export function useAdminPermissionGroupsData() {
  const { t } = useTranslation('adminPermissionGroups')
  const language = useCurrentLanguage()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchGroups = useCallback(async () => {
    setLoading(true)

    try {
      const res = await getAdminPermissionGroups()
      const groupList = res.data || []

      try {
        const permissionRes = await getAdminPermissions()
        setGroups(attachPermissionCounts(groupList, permissionRes.data || []))
      } catch {
        setGroups(groupList)
      }
    } catch {
      message.error(t('messages.fetchError'))
    } finally {
      setLoading(false)
    }
  }, [language, t])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  const handleDeleteGroup = async groupId => {
    setLoading(true)

    try {
      await deleteAdminPermissionGroup(groupId)
      message.success(t('messages.deleteSuccess'))
      await fetchGroups()
    } catch (error) {
      message.error(getPermissionGroupErrorMessage(error, t('messages.deleteError')))
    } finally {
      setLoading(false)
    }
  }

  const handleToggleGroupActive = async group => {
    setUpdatingId(group._id)

    try {
      await toggleAdminPermissionGroupActive(group._id, !group.isActive)
      message.success(!group.isActive ? t('messages.toggleActive') : t('messages.toggleInactive'))
      await fetchGroups()
    } catch (error) {
      message.error(getPermissionGroupErrorMessage(error, t('messages.toggleError')))
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
