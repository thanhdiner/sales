import { useEffect } from 'react'
import { message } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deletePermission, getPermissions } from '@/services/admin/rbac/permission'
import { adminResourceQueryKeys } from '@/hooks/shared/adminResourceList'
import { getPermissionErrorMessage } from '../utils'

const PERMISSIONS_QUERY_KEY = adminResourceQueryKeys.list('permissions', {})

export function usePermissionsData({ t = key => key } = {}) {
  const queryClient = useQueryClient()
  const permissionsQuery = useQuery({
    queryKey: PERMISSIONS_QUERY_KEY,
    queryFn: () => getPermissions(),
    staleTime: 0,
    refetchOnMount: 'always',
    meta: { persist: false }
  })
  const deleteMutation = useMutation({
    mutationFn: deletePermission,
    onSuccess: async () => {
      message.success(t('messages.deleteSuccess'))
      await queryClient.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEY })
    },
    onError: error => message.error(getPermissionErrorMessage(error, t('messages.deleteError')))
  })

  useEffect(() => {
    if (permissionsQuery.error) message.error(t('messages.fetchError'))
  }, [permissionsQuery.error, t])

  return {
    permissionList: permissionsQuery.data?.data || [],
    loading: permissionsQuery.isLoading || permissionsQuery.isFetching || deleteMutation.isPending,
    fetchPermissions: permissionsQuery.refetch,
    handleDeletePermission: permissionId => deleteMutation.mutate(permissionId)
  }
}
