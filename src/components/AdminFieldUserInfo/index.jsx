function AdminFieldUserInfo({ user }) {
  if (!user) return 'N/A'
  return (
    <span className="flex items-center gap-2">
      <img src={user?.avatarUrl} alt={user?.fullName} className="w-9 h-9 rounded-md object-cover" />
      <span>{user?.fullName}</span>
    </span>
  )
}

export default AdminFieldUserInfo
