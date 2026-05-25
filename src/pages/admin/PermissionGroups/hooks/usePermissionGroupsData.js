import { useEffect, useMemo, useState } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deletePermissionGroup, getPermissionGroups, togglePermissionGroupActive } from '@/services/admin/rbac/permissionGroup'
import { getPermissions } from '@/services/admin/rbac/permission'
import { adminResourceQueryKeys } from '@/hooks/shared/adminResourceList'
import { getPermissionGroupErrorMessage } from '../utils'

const GROUPS_QUERY_KEY = adminResourceQueryKeys.list('permission-groups', {})
const PERMISSIONS_QUERY_KEY = adminResourceQueryKeys.list('permissions', {})

function attachPermissionCounts(groups = [], permissions = []) {
  if (!permissions.length) return groups

  const countByGroup = permissions.reduce((counts, permission) => {
    if (!permission?.group || permission.deleted) return counts

    counts[permission.group] = (counts[permission.group] || 0) + 1
    return counts
  }, {})

  return groups.map(group => ({
    ...group,
    permissionCount: countByGroup[group.value] || 0
  }))
}

export function usePermissionGroupsData() {

  const { t } = useTranslation('adminPermissionGroups')
  const queryClient = useQueryClient()
  const [updatingId, setUpdatingId] = useState(null)
  const groupsQuery = useQuery({
    queryKey: GROUPS_QUERY_KEY,
    queryFn: getPermissionGroups
  })
  const permissionsQuery = useQuery({
    queryKey: PERMISSIONS_QUERY_KEY,
    queryFn: getPermissions
  })
  const groups = useMemo(
    () => attachPermissionCounts(groupsQuery.data?.data || [], permissionsQuery.data?.data || []),
    [groupsQuery.data?.data, permissionsQuery.data?.data]
  )
  const invalidateGroups = () => queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY })

  useEffect(() => {
    if (groupsQuery.error) message.error(t('messages.fetchError'))
  }, [groupsQuery.error, t])

  const deleteMutation = useMutation({
    mutationFn: deletePermissionGroup,
    onSuccess: async () => {
      message.success(t('messages.deleteSuccess'))
      await invalidateGroups()
    },
    onError: error => message.error(getPermissionGroupErrorMessage(error, t('messages.deleteError')))
  })
  const toggleMutation = useMutation({
    mutationFn: group => togglePermissionGroupActive(group._id, !group.isActive).then(() => group),
    onMutate: group => setUpdatingId(group._id),
    onSuccess: async group => {
      message.success(!group.isActive ? t('messages.toggleActive') : t('messages.toggleInactive'))
      await invalidateGroups()
    },
    onError: error => message.error(getPermissionGroupErrorMessage(error, t('messages.toggleError'))),
    onSettled: () => setUpdatingId(null)
  })

  return {
    groups,
    loading: groupsQuery.isLoading || groupsQuery.isFetching || permissionsQuery.isLoading || deleteMutation.isPending,
    updatingId,
    fetchGroups: groupsQuery.refetch,
    handleDeleteGroup: groupId => deleteMutation.mutate(groupId),
    handleToggleGroupActive: group => toggleMutation.mutate(group)
  }
}
