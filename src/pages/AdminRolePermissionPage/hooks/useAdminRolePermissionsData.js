import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import { getAdminRoles, updateAdminRoleById } from '@/services/rolesService'
import { getAdminPermissionGroups } from '@/services/permissionGroupsService'
import { getAdminPermissions } from '@/services/permissionService'
import { buildRolePermissionMap, getGroupPermissionNames, getPermissionNames } from '../utils'

export function useAdminRolePermissionsData() {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [permissionGroups, setPermissionGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [rolePerm, setRolePerm] = useState({})

  const fetchData = useCallback(async () => {
    setLoading(true)

    try {
      const [roleRes, permRes, groupRes] = await Promise.all([
        getAdminRoles(),
        getAdminPermissions(),
        getAdminPermissionGroups()
      ])

      const nextRoles = roleRes.data || []
      setRoles(nextRoles)
      setPermissions(permRes.data || [])
      setPermissionGroups(groupRes.data || [])
      setRolePerm(buildRolePermissionMap(nextRoles))
    } catch {
      message.error('Lỗi khi lấy dữ liệu')
    } finally {
      setLoading(false)
    }
  }, [])

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
        await updateAdminRoleById(role._id, {
          label: role.label,
          permissions: rolePerm[role._id]
        })
      }

      message.success('Cập nhật phân quyền thành công!')
      await fetchData()
    } catch {
      message.error('Lưu phân quyền thất bại')
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
