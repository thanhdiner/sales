import { Alert, Button, Empty, Form, Input, List, Modal, Spin, Steps, Switch, Tag, message } from 'antd'
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  MonitorSmartphone,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Trash2
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  disable2FA,
  generate2FASecret,
  get2FAStatus,
  getBackupCodes,
  getTrustedDevices,
  removeTrustedDevice,
  verify2FACode
} from '@/services/adminAccountsService'
import './TwoFactorAuthPanel.scss'

const panelClass =
  'rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5'
const softPanelClass = 'rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-4'
const iconBoxClass =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]'
const primaryButtonClass =
  'rounded-lg !border-none !bg-[var(--admin-accent)] !text-white hover:!opacity-90 disabled:!bg-[color-mix(in_srgb,var(--admin-accent)_45%,var(--admin-surface-2))] disabled:!text-white/80 disabled:!opacity-100'
const secondaryButtonClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
const ghostButtonClass =
  'rounded-lg !border-[var(--admin-accent)] !bg-transparent !text-[var(--admin-accent)] hover:!bg-[var(--admin-accent-soft)]'
const textButtonClass =
  'rounded-lg !text-[var(--admin-text-muted)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
const verifyCodeInputClass =
  'admin-twofa-code-input h-12 max-w-[220px] rounded-lg border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-center text-lg font-semibold tracking-[0.3em] text-[var(--admin-text)]'
const infoAlertClass =
  'mb-4 !border-[var(--admin-border)] !bg-[var(--admin-surface)] [&_.ant-alert-message]:!text-[var(--admin-text)] [&_.ant-alert-description]:!text-[var(--admin-text-muted)] [&_.ant-alert-icon]:!text-[var(--admin-accent)]'
const warningAlertClass =
  'mb-4 !border-[color-mix(in_srgb,#f59e0b_30%,var(--admin-border))] !bg-[color-mix(in_srgb,#f59e0b_12%,var(--admin-surface-2))] [&_.ant-alert-message]:!text-[#d97706] [&_.ant-alert-description]:!text-[var(--admin-text-muted)] [&_.ant-alert-icon]:!text-[#d97706]'
const TWO_FACTOR_STEP_BY_PARAM = {
  app: 1,
  qr: 2,
  verify: 3
}
const TWO_FACTOR_PARAM_BY_STEP = {
  1: 'app',
  2: 'qr',
  3: 'verify'
}

function getSetupStepFromParams(searchParams) {
  if (searchParams.get('twofa') !== 'setup') {
    return 0
  }

  return TWO_FACTOR_STEP_BY_PARAM[searchParams.get('twofaStep')] || 1
}

const TwoFactorAuthPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [enabled, setEnabled] = useState(false)
  const [setupStep, setSetupStep] = useState(() => getSetupStepFromParams(searchParams))
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState([])
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statusLoaded, setStatusLoaded] = useState(false)
  const [qrSecret, setQrSecret] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [trustedDevices, setTrustedDevices] = useState([])
  const [form] = Form.useForm()

  const updateSetupParams = useCallback((nextStep) => {
    setSearchParams(prevParams => {
      const nextParams = new URLSearchParams(prevParams)

      if (nextStep > 0) {
        nextParams.set('setting', 'security')
        nextParams.set('twofa', 'setup')
        nextParams.set('twofaStep', TWO_FACTOR_PARAM_BY_STEP[nextStep] || TWO_FACTOR_PARAM_BY_STEP[1])
      } else {
        nextParams.delete('twofa')
        nextParams.delete('twofaStep')
      }

      return nextParams
    }, { replace: true })
  }, [setSearchParams])

  const setSetupStepWithParams = useCallback((nextStep) => {
    setSetupStep(nextStep)
    updateSetupParams(nextStep)
  }, [updateSetupParams])

  useEffect(() => {
    const nextStep = getSetupStepFromParams(searchParams)
    setSetupStep(currentStep => (currentStep === nextStep ? currentStep : nextStep))
  }, [searchParams])

  useEffect(() => {
    const check2FAStatus = async () => {
      setLoading(true)
      try {
        const data = await get2FAStatus()
        setEnabled(data.enabled)
        setBackupCodes(data.backupCodes || [])

        if (data.enabled) {
          updateSetupParams(0)
        }

        const devicesRes = await getTrustedDevices()
        const deviceId = localStorage.getItem('trusted_device_id')
        const devices = (devicesRes.devices || []).map(device => ({
          ...device,
          current: device.deviceId === deviceId
        }))
        setTrustedDevices(devices)
      } catch (err) {
        message.error('Không thể lấy trạng thái 2FA')
      } finally {
        setLoading(false)
        setStatusLoaded(true)
      }
    }

    check2FAStatus()
  }, [updateSetupParams])

  const generateSecret = useCallback(async () => {
    setLoading(true)
    try {
      const data = await generate2FASecret()
      setQrSecret(data.secret)
      setQrUrl(data.qrUrl)
      return true
    } catch (err) {
      message.error('Không thể tạo mã xác thực')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!statusLoaded || setupStep <= 0 || enabled || qrSecret || loading) {
      return
    }

    void generateSecret()
  }, [enabled, generateSecret, loading, qrSecret, setupStep, statusLoaded])

  const handleToggle2FA = async checked => {
    if (checked) {
      const generated = await generateSecret()
      if (generated) setSetupStepWithParams(1)
      return
    }

    Modal.confirm({
      title: 'Tắt xác thực 2 bước',
      content: 'Bạn có chắc chắn muốn tắt 2FA? Điều này sẽ làm giảm mức bảo mật của tài khoản quản trị.',
      okText: 'Tắt 2FA',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        setLoading(true)
        try {
          await disable2FA()
          setEnabled(false)
          setSetupStepWithParams(0)
          setBackupCodes([])
          setQrSecret('')
          setQrUrl('')
          message.success('Đã tắt xác thực 2 bước')
        } catch (err) {
          message.error('Không thể tắt xác thực 2FA')
        } finally {
          setLoading(false)
        }
      }
    })
  }

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      message.error('Vui lòng nhập đầy đủ 6 chữ số')
      return
    }

    setLoading(true)
    try {
      const data = await verify2FACode(verificationCode)
      if (data.success) {
        setEnabled(true)
        setSetupStepWithParams(0)
        setShowBackupModal(true)
        setBackupCodes(data.backupCodes || [])
        setVerificationCode('')
        setQrSecret('')
        setQrUrl('')
        message.success('Xác thực 2 bước đã được thiết lập thành công')
      } else {
        message.error(data.message || 'Mã xác thực không hợp lệ')
      }
    } catch (err) {
      message.error('Không thể xác thực 2FA')
    } finally {
      setLoading(false)
    }
  }

  const regenerateBackupCodes = () => {
    Modal.confirm({
      title: 'Tạo mã dự phòng mới',
      content: 'Các mã cũ sẽ không còn hiệu lực. Bạn có chắc chắn muốn tạo bộ mã mới?',
      okText: 'Tạo mới',
      cancelText: 'Hủy',
      onOk: async () => {
        setLoading(true)
        try {
          const data = await getBackupCodes()
          setBackupCodes(data.codes || [])
          setShowBackupModal(true)
          message.success('Đã tạo mã dự phòng mới')
        } catch (err) {
          message.error('Không thể tạo mã dự phòng mới')
        } finally {
          setLoading(false)
        }
      }
    })
  }

  const copyToClipboard = async text => {
    try {
      await navigator.clipboard.writeText(text)
      message.success('Đã sao chép vào clipboard')
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      message.success('Đã sao chép vào clipboard')
    }
  }

  const copyBackupCodes = () => {
    copyToClipboard(backupCodes.join('\n'))
  }

  const downloadBackupCodes = () => {
    const content = `Mã dự phòng xác thực 2 bước - SmartMall Admin\nTạo ngày: ${new Date().toLocaleDateString('vi-VN')}\n\n${backupCodes.join(
      '\n'
    )}\n\nLưu ý: Mỗi mã chỉ sử dụng được một lần. Hãy lưu ở nơi an toàn.`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup-codes-${new Date().getTime()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    message.success('Đã tải xuống mã dự phòng')
  }

  const removeDevice = deviceId => {
    Modal.confirm({
      title: 'Xóa thiết bị tin cậy',
      content: 'Thiết bị này sẽ cần xác thực lại khi đăng nhập lần tiếp theo.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        setLoading(true)
        try {
          await removeTrustedDevice(deviceId)
          setTrustedDevices(prev => prev.filter(device => device.deviceId !== deviceId))
          message.success('Đã xóa thiết bị khỏi danh sách tin cậy')
        } catch (err) {
          message.error('Không thể xóa thiết bị')
        } finally {
          setLoading(false)
        }
      }
    })
  }

  const setupSteps = [
    {
      title: 'Tải ứng dụng',
      description: 'Cài Google Authenticator hoặc ứng dụng 2FA tương thích.'
    },
    {
      title: 'Quét mã QR',
      description: 'Thêm tài khoản quản trị vào ứng dụng xác thực.'
    },
    {
      title: 'Xác thực',
      description: 'Nhập mã 6 chữ số để hoàn tất.'
    }
  ]

  if (setupStep > 0) {
    return (
      <section className={panelClass}>
        <div className="mb-5 flex items-start gap-3">
          <div className={iconBoxClass}>
            <QrCode className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--admin-text)]">Thiết lập xác thực 2 bước</h2>
            <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
              Hoàn tất các bước bên dưới để bật 2FA cho tài khoản quản trị.
            </p>
          </div>
        </div>

        <Steps current={setupStep - 1} items={setupSteps} responsive className="admin-twofa-steps mb-6" />

        {setupStep === 1 && (
          <div className={softPanelClass}>
            <Alert
              type="info"
              showIcon
              message="Bước 1: Tải ứng dụng Authenticator"
              description="Bạn cần một ứng dụng xác thực để tạo mã đăng nhập. Chọn một ứng dụng bên dưới hoặc dùng ứng dụng 2FA bạn đang có."
              className={infoAlertClass}
            />

            <div className="grid gap-2 sm:grid-cols-3">
              <Button
                type="primary"
                icon={<Smartphone className="h-4 w-4" />}
                onClick={() => window.open('https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2', '_blank')}
                className={`h-10 ${primaryButtonClass}`}
              >
                Google
              </Button>
              <Button
                icon={<Smartphone className="h-4 w-4" />}
                onClick={() => window.open('https://www.microsoft.com/en-us/security/mobile-authenticator-app', '_blank')}
                className={`h-10 ${secondaryButtonClass}`}
              >
                Microsoft
              </Button>
              <Button
                icon={<Smartphone className="h-4 w-4" />}
                onClick={() => window.open('https://authy.com/', '_blank')}
                className={`h-10 ${secondaryButtonClass}`}
              >
                Authy
              </Button>
            </div>

            <div className="mt-5 flex justify-end">
              <Button type="primary" onClick={() => setSetupStepWithParams(2)} className={primaryButtonClass}>
                Tiếp tục
              </Button>
            </div>
          </div>
        )}

        {setupStep === 2 && (
          <div className={softPanelClass}>
            <Alert
              type="info"
              showIcon
              message="Bước 2: Quét mã QR"
              description="Mở ứng dụng authenticator và quét mã QR để thêm tài khoản."
              className={infoAlertClass}
            />

            <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
              <div className="flex justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
                {qrUrl ? <img src={qrUrl} alt="QR Code" className="h-[180px] w-[180px]" /> : <Spin />}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--admin-text)]">Không quét được mã?</p>
                <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
                  Nhập thủ công secret key bên dưới vào ứng dụng xác thực.
                </p>
                <button
                  type="button"
                  onClick={() => copyToClipboard(qrSecret)}
                  className="mt-3 block w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-left font-mono text-xs text-[var(--admin-text)] transition hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-accent-soft)]"
                >
                  {qrSecret || 'Đang tạo secret key...'}
                </button>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button onClick={() => setSetupStepWithParams(1)} className={secondaryButtonClass}>
                Quay lại
              </Button>
              <Button type="primary" onClick={() => setSetupStepWithParams(3)} className={primaryButtonClass}>
                Đã quét xong
              </Button>
            </div>
          </div>
        )}

        {setupStep === 3 && (
          <div className={softPanelClass}>
            <Alert
              type="info"
              showIcon
              message="Bước 3: Xác thực"
              description="Nhập mã 6 chữ số đang hiển thị trong ứng dụng authenticator."
              className={infoAlertClass}
            />

            <Form form={form} onFinish={handleVerifyCode}>
              <Input
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className={verifyCodeInputClass}
                size="large"
                autoComplete="off"
              />

              <div className="mt-5 flex justify-end gap-2">
                <Button onClick={() => setSetupStepWithParams(2)} disabled={loading} className={secondaryButtonClass}>
                  Quay lại
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={verificationCode.length !== 6}
                  loading={loading}
                  className={primaryButtonClass}
                >
                  Hoàn tất thiết lập
                </Button>
              </div>
            </Form>
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <Button
            type="text"
            onClick={() => {
              setSetupStepWithParams(0)
              setQrSecret('')
              setQrUrl('')
              setVerificationCode('')
            }}
            disabled={loading}
            className={textButtonClass}
          >
            Hủy thiết lập
          </Button>
        </div>
      </section>
    )
  }

  if (loading && setupStep === 0) {
    return (
      <section className={`${panelClass} flex min-h-[240px] flex-col items-center justify-center text-center`}>
        <Spin size="large" />
        <p className="mt-3 text-sm text-[var(--admin-text-muted)]">Đang kiểm tra trạng thái bảo mật...</p>
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <div className={panelClass}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <div className={iconBoxClass}>
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--admin-text)]">Xác thực 2 bước</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--admin-text-muted)]">
                Bật 2FA để yêu cầu mã xác thực từ điện thoại khi đăng nhập vào khu vực quản trị.
              </p>

              <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                enabled
                  ? 'bg-[color-mix(in_srgb,#22c55e_16%,var(--admin-surface-2))] text-[#22c55e]'
                  : 'bg-[color-mix(in_srgb,#ef4444_16%,var(--admin-surface-2))] text-[#ef4444]'
              }`}
              >
                {enabled ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                {enabled ? 'Đang bật' : 'Đang tắt'}
              </div>
            </div>
          </div>

          <Switch checked={enabled} onChange={handleToggle2FA} loading={loading} />
        </div>
      </div>

      {enabled && (
        <>
          <div className="grid gap-5 lg:grid-cols-2">
            <div className={panelClass}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className={iconBoxClass}>
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--admin-text)]">Mã dự phòng</h3>
                    <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
                      Dùng khi bạn không còn thiết bị authenticator.
                    </p>
                  </div>
                </div>
                <Button
                  type="text"
                  icon={<RefreshCw className="h-4 w-4" />}
                  onClick={regenerateBackupCodes}
                  className={textButtonClass}
                >
                  Tạo mới
                </Button>
              </div>

              <div className={softPanelClass}>
                <p className="text-sm text-[var(--admin-text-muted)]">
                  Còn <span className="font-semibold text-[var(--admin-text)]">{backupCodes.length}</span> mã dự phòng khả dụng.
                </p>

                {showBackupCodes && backupCodes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {backupCodes.slice(0, 3).map(code => (
                      <code
                        key={code}
                        className="rounded-md bg-[var(--admin-surface)] px-2 py-1 text-xs text-[var(--admin-text)] ring-1 ring-[var(--admin-border)]"
                      >
                        {code}
                      </code>
                    ))}
                    {backupCodes.length > 3 && (
                      <span className="text-xs text-[var(--admin-text-subtle)]">+{backupCodes.length - 3} mã khác</span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <Button
                  icon={showBackupCodes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  onClick={() => setShowBackupCodes(value => !value)}
                  disabled={backupCodes.length === 0}
                  className={secondaryButtonClass}
                >
                  {showBackupCodes ? 'Ẩn' : 'Hiện'}
                </Button>
                <Button
                  icon={<Copy className="h-4 w-4" />}
                  onClick={copyBackupCodes}
                  disabled={backupCodes.length === 0}
                  className={secondaryButtonClass}
                >
                  Sao chép
                </Button>
                <Button
                  type="primary"
                  ghost
                  onClick={() => setShowBackupModal(true)}
                  disabled={backupCodes.length === 0}
                  className={ghostButtonClass}
                >
                  Chi tiết
                </Button>
              </div>
            </div>

            <div className={panelClass}>
              <div className="mb-4 flex items-start gap-3">
                <div className={iconBoxClass}>
                  <MonitorSmartphone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--admin-text)]">Thiết bị tin cậy</h3>
                  <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
                    {trustedDevices.length} thiết bị đã được ghi nhớ sau khi xác thực.
                  </p>
                </div>
              </div>

              <List
                dataSource={trustedDevices}
                locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có thiết bị tin cậy" /> }}
                renderItem={device => (
                  <List.Item
                    className="rounded-lg px-2 transition hover:bg-[var(--admin-surface-2)]"
                    actions={[
                      !device.current && (
                        <Button
                          key="remove"
                          type="text"
                          danger
                          icon={<Trash2 className="h-4 w-4" />}
                          onClick={() => removeDevice(device.deviceId)}
                          className="rounded-lg"
                        >
                          Xóa
                        </Button>
                      )
                    ].filter(Boolean)}
                  >
                    <List.Item.Meta
                      title={
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-[var(--admin-text)]">{device.name || 'Thiết bị'}</span>
                          {device.current && <Tag color="green">Hiện tại</Tag>}
                        </div>
                      }
                      description={
                        <div className="space-y-1 text-xs text-[var(--admin-text-muted)]">
                          <div className="line-clamp-1">{device.browser || 'Không rõ trình duyệt'}</div>
                          <div>Lần cuối: {device.lastUsed ? new Date(device.lastUsed).toLocaleString('vi-VN') : 'Chưa có dữ liệu'}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </div>

          <div className={panelClass}>
            <Alert
              type="info"
              showIcon
              message="Lời khuyên bảo mật"
              description={
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  <li>Lưu mã dự phòng ở nơi an toàn, tách biệt với thiết bị chính.</li>
                  <li>Không chia sẻ mã xác thực hoặc mã dự phòng với bất kỳ ai.</li>
                  <li>Định kỳ kiểm tra và xóa các thiết bị không còn sử dụng.</li>
                </ul>
              }
              className={infoAlertClass}
            />
          </div>
        </>
      )}

      <Modal
        className="admin-twofa-modal"
        title="Mã dự phòng xác thực 2 bước"
        open={showBackupModal}
        onCancel={() => setShowBackupModal(false)}
        width={620}
        footer={[
          <Button key="copy" icon={<Copy className="h-4 w-4" />} onClick={copyBackupCodes} className={secondaryButtonClass}>
            Sao chép tất cả
          </Button>,
          <Button key="download" icon={<Download className="h-4 w-4" />} onClick={downloadBackupCodes} className={secondaryButtonClass}>
            Tải xuống file
          </Button>,
          <Button key="close" type="primary" onClick={() => setShowBackupModal(false)} className={primaryButtonClass}>
            Đã lưu an toàn
          </Button>
        ]}
      >
        <Alert
          type="warning"
          showIcon
          message="Lưu ý quan trọng"
          description="Hãy lưu những mã này ở nơi an toàn. Mỗi mã chỉ có thể sử dụng một lần."
          className={warningAlertClass}
        />
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-[var(--admin-surface-2)] p-4 sm:grid-cols-3">
          {backupCodes.map(code => (
            <button
              key={code}
              type="button"
              onClick={() => copyToClipboard(code)}
              className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 font-mono text-sm font-semibold tracking-[0.12em] text-[var(--admin-text)] transition hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-accent-soft)]"
            >
              {code}
            </button>
          ))}
        </div>
      </Modal>
    </section>
  )
}

export default TwoFactorAuthPanel
