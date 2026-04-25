import ChangePasswordForm from './ChangePasswordForm'
import TwoFactorAuthPanel from './TwoFactorAuthPanel'

const AdminSecurityTab = () => {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.4fr)]">
      <ChangePasswordForm />
      <TwoFactorAuthPanel />
    </div>
  )
}

export default AdminSecurityTab
