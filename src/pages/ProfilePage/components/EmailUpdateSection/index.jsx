import React, { useEffect, useState } from 'react'
import { Alert, Input, Button, message } from 'antd'
import { MailOutlined, SafetyOutlined } from '@ant-design/icons'
import { requestEmailUpdate, confirmEmailUpdate } from '@/services/userService'

function EmailUpdateSection({ user, onEmailUpdated }) {
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
      message.error('Vui lòng nhập email hợp lệ!')
      return
    }
    setLoading(true)
    try {
      await requestEmailUpdate(newEmail)
      setStep(1)
      message.success('Mã xác thực đã gửi tới email mới!')
    } catch (err) {
      message.error(err?.message || 'Gửi mã xác thực thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verifyCode) {
      message.error('Nhập mã xác thực!')
      return
    }
    setLoading(true)
    try {
      await confirmEmailUpdate(newEmail, verifyCode)
      message.success('Cập nhật email thành công!')
      setStep(0)
      setNewEmail('')
      setVerifyCode('')
      setIsEmailUpdated(true)
      onEmailUpdated?.()
    } catch (err) {
      message.error(err?.message || 'Xác thực thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)
    try {
      await requestEmailUpdate(newEmail)
      message.success('Đã gửi lại mã xác thực!')
    } catch (err) {
      message.error(err?.message || 'Gửi lại mã thất bại!')
    } finally {
      setLoading(false)
    }
  }

  if (showSuccess) {
    return <Alert type="success" showIcon message="Email đã cập nhật thành công!" className="mb-3" />
  }

  if (user?.email && !user.email.endsWith('@github.com') && !user.email.endsWith('@facebook.com') && user.email !== '') {
    return null
  }

  return (
    <div>
      <Alert
        message="🔐 Bảo mật tài khoản"
        description="Bạn cần cập nhật email cá nhân để bảo vệ tài khoản và có thể khôi phục mật khẩu khi cần thiết."
        type="error"
        showIcon
        className="mb-3"
      />

      {step === 0 && (
        <>
          <Input
            prefix={<MailOutlined />}
            placeholder="Nhập email cá nhân của bạn"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            disabled={loading}
            className="mb-2"
          />
          <Button type="primary" onClick={handleSendCode} loading={loading} block>
            Xác nhận email mới
          </Button>
        </>
      )}

      {step === 1 && (
        <>
          <Alert type="info" message={`Mã xác thực đã gửi tới ${newEmail}`} showIcon className="mb-2" />
          <Input
            prefix={<SafetyOutlined />}
            placeholder="Nhập mã xác thực 6 số"
            value={verifyCode}
            onChange={e => setVerifyCode(e.target.value)}
            maxLength={6}
            className="mb-2"
            disabled={loading}
          />
          <Button type="primary" onClick={handleVerifyCode} loading={loading} block>
            Xác nhận mã
          </Button>
          <Button type="link" onClick={handleResendCode} disabled={loading}>
            Gửi lại mã
          </Button>
        </>
      )}
    </div>
  )
}

export default EmailUpdateSection
