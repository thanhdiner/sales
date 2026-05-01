import { useCallback } from 'react'
import { Form } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { updateProfile as reduxUpdateProfile } from '@/stores/client/user'
import { getClientMe } from '@/services/client/auth/user'
import SEO from '@/components/shared/SEO'
import CheckoutProfileCard from './sections/CheckoutProfileCard'
import EmailUpdateModal from './components/EmailUpdateModal'
import EmailWarningBanner from './components/EmailWarningBanner'
import ProfileDetailsCard from './sections/ProfileDetailsCard'
import ProfileHeader from './sections/ProfileHeader'
import ProfileLoadingState from './components/ProfileLoadingState'
import ProfileSummaryCard from './sections/ProfileSummaryCard'
import { useCheckoutProfileForm } from './hooks/useCheckoutProfileForm'
import { useProfileDetails } from './hooks/useProfileDetails'
import { useProfileEmailModal } from './hooks/useProfileEmailModal'

function Profile() {
  const { t } = useTranslation('clientProfile')
  const dispatch = useDispatch()
  const user = useSelector(state => state.clientUser.user)
  const [form] = Form.useForm()
  const [checkoutForm] = Form.useForm()

  const {
    avatarPreview,
    emailWarning,
    handleFileChange,
    handleRemoveAvatar,
    handleSaveProfile,
    inputRef,
    loading
  } = useProfileDetails({
    dispatch,
    form,
    t,
    user
  })

  const {
    emailStep,
    handleChangeEmail,
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

  const {
    addressError,
    addressLoading,
    checkoutAddressPreview,
    checkoutDeliveryOptions,
    checkoutDistrictCode,
    checkoutLoading,
    checkoutPaymentOptions,
    checkoutProvinceCode,
    districtOptions,
    handleRestoreCheckoutProfile,
    handleSaveCheckoutProfile,
    provinceOptions,
    syncCheckoutAddressFields,
    wardOptions
  } = useCheckoutProfileForm({
    checkoutForm,
    dispatch,
    t,
    user
  })

  const handleEmailUpdated = useCallback(async () => {
    const res = await getClientMe()
    dispatch(reduxUpdateProfile(res))
  }, [dispatch])

  if (!user) {
    return <ProfileLoadingState t={t} />
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 dark:bg-gray-900">
      <SEO title={t('seo.title')} noIndex />

      <div className="mx-auto max-w-6xl">
        <ProfileHeader t={t} />

        <EmailWarningBanner emailWarning={emailWarning} onChangeEmail={handleChangeEmail} t={t} />

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
          <ProfileSummaryCard
            avatarPreview={avatarPreview}
            inputRef={inputRef}
            onFileChange={handleFileChange}
            onRemoveAvatar={handleRemoveAvatar}
            t={t}
            user={user}
          />

          <ProfileDetailsCard
            form={form}
            loading={loading}
            onChangeEmail={handleChangeEmail}
            onEmailUpdated={handleEmailUpdated}
            onSaveProfile={handleSaveProfile}
            t={t}
            user={user}
          />
        </div>

        <CheckoutProfileCard
          addressError={addressError}
          addressLoading={addressLoading}
          checkoutAddressPreview={checkoutAddressPreview}
          checkoutDeliveryOptions={checkoutDeliveryOptions}
          checkoutDistrictCode={checkoutDistrictCode}
          checkoutForm={checkoutForm}
          checkoutLoading={checkoutLoading}
          checkoutPaymentOptions={checkoutPaymentOptions}
          checkoutProvinceCode={checkoutProvinceCode}
          districtOptions={districtOptions}
          onRestoreCheckoutProfile={handleRestoreCheckoutProfile}
          onSaveCheckoutProfile={handleSaveCheckoutProfile}
          provinceOptions={provinceOptions}
          syncCheckoutAddressFields={syncCheckoutAddressFields}
          t={t}
          wardOptions={wardOptions}
        />

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
    </div>
  )
}

export default Profile
