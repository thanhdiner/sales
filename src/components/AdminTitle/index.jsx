function AdminTitle({ icon, title }) {
  return (
    <div className="admin-title dark:text-gray-300">
      {icon}
      <h1 className="admin-heading">{title}</h1>
    </div>
  )
}

export default AdminTitle
