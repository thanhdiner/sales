import ChangePasswordForm from './ChangePasswordForm'
import TwoFactorAuthPanel from './TwoFactorAuthPanel'

const SecurityTab = () => {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.4fr)]">
      <ChangePasswordForm />
      <div className="xl:border-l xl:border-[color-mix(in_srgb,var(--admin-border)_70%,transparent)] xl:pl-10">
        <TwoFactorAuthPanel />
      </div>
    </div>
  )
}

export default SecurityTab
