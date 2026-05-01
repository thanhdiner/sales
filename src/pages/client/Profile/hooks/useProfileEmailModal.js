import { useState } from 'react'
import { message } from 'antd'
import { updateProfile as reduxUpdateProfile } from '@/stores/client/user'
import { confirmEmailUpdate, requestEmailUpdate } from '@/services/client/auth/user'

export function useProfileEmailModal({ dispatch, t, user }) {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emailStep, setEmailStep] = useState(0)
  const [verifyCode, setVerifyCode] = useState('')
  const [updatingEmail, setUpdatingEmail] = useState(false)

  const handleChangeEmail = () => {
    setShowEmailModal(true)
    setEmailStep(0)
    setNewEmail('')
    setVerifyCode('')
  }

  const handleSendCode = async () => {
    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      message.error(t('message.invalidEmail'))
      return
    }

    setUpdatingEmail(true)

    try {
      const res = await requestEmailUpdate(newEmail)
      message.success(res.message || t('message.sendCodeSuccess'))
      setEmailStep(1)
    } catch (err) {
      message.error(err?.message || t('message.sendCodeFailed'))
    } finally {
      setUpdatingEmail(false)
    }
  }

  const handleVerifyEmail = async () => {
    if (!verifyCode) return message.error(t('message.requiredVerifyCode'))

    setUpdatingEmail(true)

    try {
      const res = await confirmEmailUpdate(newEmail, verifyCode)
      setShowEmailModal(false)
      dispatch(reduxUpdateProfile({ ...user, email: newEmail }))
      message.success(res.message || t('message.emailUpdateSuccess'))
    } catch (err) {
      message.error(err?.message || t('message.verifyFailed'))
    } finally {
      setUpdatingEmail(false)
    }
  }

  return {
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
  }
}
