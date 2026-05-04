import { Form, message } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import MobileBackButton from '@/components/shared/MobileBackButton'
import SEO from '@/components/shared/SEO'
import { clearClientSessionState } from '@/lib/client/clientCache'
import { userLogout } from '@/services/client/auth/user'
import { clearClientTokens, clearClientTokensSession } from '@/utils/auth'
import EmailUpdateModal from '../Profile/components/EmailUpdateModal'
import MobileAccountDashboard from '../Profile/sections/MobileAccountDashboard'
import ProfileLoadingState from '../Profile/components/ProfileLoadingState'
import { useProfileDetails } from '../Profile/hooks/useProfileDetails'
import { useProfileEmailModal } from '../Profile/hooks/useProfileEmailModal'

function Me() {
  const { t } = useTranslation('clientProfile')
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.clientUser.user)
  const [form] = Form.useForm()

  const { avatarPreview, handleFileChange, inputRef } = useProfileDetails({
    dispatch,
    form,
    t,
    user
  })

  const {
    emailStep,
    handleSendCode,
    handleVerifyEmail,
    newEmail,
    setNewEmail,
    setShowEmailModal,
    setVerifyCode,
    showEmailModal,
    updatingEmail,
    verifyCode
  } = useProfileEmailModal({
    dispatch,
    t,
    user
  })

  const handleLogout = async () => {
    try {
      await userLogout()
      message.success(tCommon('account.logoutSuccess'))
    } catch {
      message.warning(tCommon('account.logoutWarning'))
    }

    clearClientTokens()
    clearClientTokensSession()
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
    clearClientSessionState(dispatch)
    navigate('/')
  }

  if (!user) {
    return <ProfileLoadingState t={t} />
  }

  return (
    <div className="bg-gray-50 px-4 py-6 dark:bg-gray-900 lg:min-h-screen lg:bg-white lg:py-10">
      <SEO title={t('seo.title')} noIndex />

      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-3 md:hidden">
          <MobileBackButton label={t('form.back')} className="!mb-0" />

          <button
            type="button"
            onClick={handleLogout}
            aria-label={tCommon('account.logout')}
            title={tCommon('account.logout')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
          >
            <LogoutOutlined />
          </button>
        </div>

        <MobileAccountDashboard
          avatarPreview={avatarPreview}
          inputRef={inputRef}
          onFileChange={handleFileChange}
          t={t}
          user={user}
        />
      </div>

      <EmailUpdateModal
        emailStep={emailStep}
        newEmail={newEmail}
        onCancel={() => setShowEmailModal(false)}
        onSendCode={handleSendCode}
        onVerifyEmail={handleVerifyEmail}
        open={showEmailModal}
        setNewEmail={setNewEmail}
        setVerifyCode={setVerifyCode}
        t={t}
        updatingEmail={updatingEmail}
        verifyCode={verifyCode}
      />
    </div>
  )
}

export default Me
