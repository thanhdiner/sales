import { PlusCircleFilled } from '@ant-design/icons'
import { AdminButton } from '@/components/admin/ui'

function ResourceAddButton({ buttonClassName, icon = <PlusCircleFilled />, label, to, variant = 'add', ...props }) {
  return (
    <AdminButton className={buttonClassName} icon={icon} to={to} variant={variant} {...props}>
      {label}
    </AdminButton>
  )
}

export default ResourceAddButton
