import { Button } from 'antd'
import { Link } from 'react-router-dom'

const variantClassNames = {
  primary: 'admin-ui-button--primary',
  secondary: 'admin-ui-button--secondary',
  danger: 'admin-ui-button--danger',
  add: 'admin-resource-btn--add',
  ghost: 'admin-ui-button--ghost'
}

function AdminButton({ children, className = '', icon, to, variant = 'secondary', ...props }) {
  const button = (
    <Button className={['admin-ui-button', variantClassNames[variant], className].filter(Boolean).join(' ')} icon={icon} {...props}>
      {children}
    </Button>
  )

  if (!to) return button

  return <Link to={to}>{button}</Link>
}

export default AdminButton
