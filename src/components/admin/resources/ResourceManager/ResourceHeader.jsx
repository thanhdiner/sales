import AdminTitle from '@/components/admin/Title'

function ResourceHeader({ className, filter, icon, title, utility }) {
  return (
    <>
      <div className={className}>
        <AdminTitle icon={icon} title={title} />
        {utility}
      </div>
      {filter}
    </>
  )
}

export default ResourceHeader
