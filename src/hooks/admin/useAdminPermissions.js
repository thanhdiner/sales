import { useSelector } from 'react-redux'

export default function useAdminPermissions() {
  const user = useSelector(state => state.adminUser.user)
  return user?.role_id?.permissions || []
}
