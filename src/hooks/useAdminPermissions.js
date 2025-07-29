import { useSelector } from 'react-redux'

export default function useAdminPermissions() {
  const user = useSelector(state => state.user.user)
  return user?.role_id?.permissions || []
}
