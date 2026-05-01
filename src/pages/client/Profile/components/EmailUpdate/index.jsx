import React, { useEffect, useState } from 'react'
import { Alert, Input, Button, message } from 'antd'
import { MailOutlined, SafetyOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { requestEmailUpdate, confirmEmailUpdate } from '@/services/client/auth/user'

function EmailUpdate({ user, onEmailUpdated }) {
  const { t } = useTranslation('clientProfile')
  const [newEmail, setNewEmail] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isEmailUpdated, setIsEmailUpdated] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (user?.email && !user.email.endsWith('@github.com') && !user.email.endsWith('@facebook.com') && user.email !== '') {
      setStep(0)
      setNewEmail('')
      setVerifyCode('')
      setIsEmailUpdated(false)
      setShowSuccess(false)
    }
  }, [user?.email])

  useEffect(() => {
    if (isEmailUpdated) {
      setShowSuccess(true)
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isEmailUpdated])

  const handleSendCode = async () => {
    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      message.error(t('emailUpdateSection.message.invalidEmail'))
      return
    }

    setLoading(true)

    try {
      await requestEmailUpdate(newEmail)
      setStep(1)
      message.success(t('emailUpdateSection.message.sendCodeSuccess'))
    } catch (err) {
      message.error(err?.message || t('emailUpdateSection.message.sendCodeFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verifyCode) {
      message.error(t('emailUpdateSection.message.requiredVerifyCode'))
      return
    }

    setLoading(true)

    try {
      await confirmEmailUpdate(newEmail, verifyCode)
      message.success(t('emailUpdateSection.message.updateSuccess'))
      setStep(0)
      setNewEmail('')
      setVerifyCode('')
      setIsEmailUpdated(true)
      onEmailUpdated?.()
    } catch (err) {
      message.error(err?.message || t('emailUpdateSection.message.verifyFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)

    try {
      await requestEmailUpdate(newEmail)
      message.success(t('emailUpdateSection.message.resendSuccess'))
    } catch (err) {
      message.error(err?.message || t('emailUpdateSection.message.resendFailed'))
    } finally {
      setLoading(false)
    }
  }

  if (showSuccess) {
    return <Alert type="success" showIcon message={t('emailUpdateSection.successAlert')} className="mb-3" />
  }

  if (user?.email && !user.email.endsWith('@github.com') && !user.email.endsWith('@facebook.com') && user.email !== '') {
    return null
  }

  return (
    <div>
      <Alert
        message={t('emailUpdateSection.securityTitle')}
        description={t('emailUpdateSection.securityDescription')}
        type="error"
        showIcon
        className="mb-3"
      />

      {step === 0 && (
        <>
          <Input
            prefix={<MailOutlined />}
            placeholder={t('emailUpdateSection.emailPlaceholder')}
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            disabled={loading}
            className="mb-2"
          />

          <Button type="primary" onClick={handleSendCode} loading={loading} block>
            {t('emailUpdateSection.confirmEmailButton')}
          </Button>
        </>
      )}

      {step === 1 && (
        <>
          <Alert type="info" message={t('emailUpdateSection.codeSent', { email: newEmail })} showIcon className="mb-2" />

          <Input
            prefix={<SafetyOutlined />}
            placeholder={t('emailUpdateSection.codePlaceholder')}
            value={verifyCode}
            onChange={e => setVerifyCode(e.target.value)}
            maxLength={6}
            className="mb-2"
            disabled={loading}
          />

          <Button type="primary" onClick={handleVerifyCode} loading={loading} block>
            {t('emailUpdateSection.confirmCodeButton')}
          </Button>

          <Button type="link" onClick={handleResendCode} disabled={loading}>
            {t('emailUpdateSection.resendCodeButton')}
          </Button>
        </>
      )}
    </div>
  )
}

export default EmailUpdate
