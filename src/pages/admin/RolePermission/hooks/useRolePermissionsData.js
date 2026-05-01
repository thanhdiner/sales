import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { getRoles, updateRolePermissionsById } from '@/services/admin/rbac/role'
import { getPermissionGroups } from '@/services/admin/rbac/permissionGroup'
import { getPermissions } from '@/services/admin/rbac/permission'
import { buildRolePermissionMap, getGroupPermissionNames, getPermissionNames } from '../utils'

export function useRolePermissionsData() {
  const { t } = useTranslation('adminRolePermission')
  const language = useCurrentLanguage()
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [permissionGroups, setPermissionGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [rolePerm, setRolePerm] = useState({})

  const fetchData = useCallback(async () => {
    setLoading(true)

    try {
      const [roleRes, permRes, groupRes] = await Promise.all([
        getRoles(),
        getPermissions(),
        getPermissionGroups()
      ])

      const nextRoles = roleRes.data || []
      setRoles(nextRoles)
      setPermissions(permRes.data || [])
      setPermissionGroups(groupRes.data || [])
      setRolePerm(buildRolePermissionMap(nextRoles))
    } catch {
      message.error(t('messages.fetchError'))
    } finally {
      setLoading(false)
    }
  }, [language, t])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRoleSelectAll = (roleId, checked) => {
    const permissionNames = getPermissionNames(permissions)

    setRolePerm(prev => ({
      ...prev,
      [roleId]: checked ? permissionNames : []
    }))
  }

  const handleGroupSelectAll = (roleId, groupValue, checked) => {
    const groupPermissionNames = getGroupPermissionNames(permissions, groupValue)

    setRolePerm(prev => {
      const nextPermissions = new Set(prev[roleId] || [])

      if (checked) {
        groupPermissionNames.forEach(permissionName => nextPermissions.add(permissionName))
      } else {
        groupPermissionNames.forEach(permissionName => nextPermissions.delete(permissionName))
      }

      return {
        ...prev,
        [roleId]: Array.from(nextPermissions)
      }
    })
  }

  const handleCheckbox = (roleId, permissionName, checked) => {
    setRolePerm(prev => {
      const nextPermissions = new Set(prev[roleId] || [])

      if (checked) {
        nextPermissions.add(permissionName)
      } else {
        nextPermissions.delete(permissionName)
      }

      return {
        ...prev,
        [roleId]: Array.from(nextPermissions)
      }
    })
  }

  const handleUpdate = async () => {
    setLoading(true)

    try {
      for (const role of roles) {
        await updateRolePermissionsById(role._id, rolePerm[role._id])
      }

      message.success(t('messages.updateSuccess'))
      await fetchData()
    } catch {
      message.error(t('messages.updateError'))
    } finally {
      setLoading(false)
    }
  }

  return {
    roles,
    permissions,
    permissionGroups,
    loading,
    rolePerm,
    handleRoleSelectAll,
    handleGroupSelectAll,
    handleCheckbox,
    handleUpdate
  }
}