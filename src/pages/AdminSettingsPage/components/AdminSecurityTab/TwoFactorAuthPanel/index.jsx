import { Card, Switch, Typography, Button, Steps, Input, Space, List, Tag, Modal, message, Alert, Form, Spin } from 'antd'
import { useState, useEffect } from 'react'
import {
  MobileOutlined,
  SafetyOutlined,
  KeyOutlined,
  DeleteOutlined,
  CopyOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import './TwoFactorAuthPanel.scss'
import {
  generate2FASecret,
  get2FAStatus,
  disable2FA,
  verify2FACode,
  getBackupCodes,
  getTrustedDevices,
  removeTrustedDevice
} from '@/services/adminAccountsService'

const { Title, Paragraph, Text } = Typography

const TwoFactorAuthPage = () => {
  const [enabled, setEnabled] = useState(false)
  const [setupStep, setSetupStep] = useState(0)
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState([])
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [loading, setLoading] = useState(false)
  const [qrSecret, setQrSecret] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [trustedDevices, setTrustedDevices] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    const check2FAStatus = async () => {
      setLoading(true)
      try {
        const data = await get2FAStatus()
        setEnabled(data.enabled)
        setBackupCodes(data.backupCodes || [])
        const devicesRes = await getTrustedDevices()
        const deviceId = localStorage.getItem('trusted_device_id')
        const devices = (devicesRes.devices || []).map(d => ({
          ...d,
          current: d.deviceId === deviceId
        }))
        setTrustedDevices(devices)
      } catch (err) {
        message.error('Không thể lấy trạng thái 2FA')
      }
      setLoading(false)
    }
    check2FAStatus()
  }, [])

  const generateSecret = async () => {
    setLoading(true)
    try {
      const data = await generate2FASecret()
      setQrSecret(data.secret)
      setQrUrl(data.qrUrl)
    } catch (err) {
      message.error('Không thể tạo mã xác thực')
    }
    setLoading(false)
  }

  const handleToggle2FA = async checked => {
    if (checked) {
      await generateSecret()
      setSetupStep(1)
    } else {
      Modal.confirm({
        title: <span className="dark:text-gray-300">Tắt xác thực 2 bước</span>,
        content: (
          <span className="dark:text-gray-400">Bạn có chắc chắn muốn tắt xác thực 2 bước? Điều này sẽ làm giảm bảo mật tài khoản.</span>
        ),
        okText: 'Tắt',
        cancelText: 'Hủy',
        okType: 'danger',
        onOk: async () => {
          setLoading(true)
          try {
            await disable2FA()
            setEnabled(false)
            setSetupStep(0)
            setBackupCodes([])
            message.success('Đã tắt xác thực 2 bước')
          } catch (err) {
            message.error('Không thể tắt xác thực 2FA')
          }
          setLoading(false)
        }
      })
    }
  }

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      message.error('Vui lòng nhập đầy đủ 6 chữ số')
      return
    }
    setLoading(true)
    try {
      const data = await verify2FACode(verificationCode)
      console.log(data)
      if (data.success) {
        setEnabled(true)
        setSetupStep(0)
        setShowBackupModal(true)
        setBackupCodes(data.backupCodes || [])
        message.success('Xác thực 2 bước đã được thiết lập thành công!')
      } else {
        message.error(data.message || 'Mã xác thực không hợp lệ')
      }
    } catch (err) {
      message.error('Không thể xác thực 2FA')
    }
    setLoading(false)
  }

  const regenerateBackupCodes = () => {
    Modal.confirm({
      title: <span className="dark:text-gray-300">Tạo mã dự phòng mới</span>,
      content: <span className="dark:text-gray-400">Các mã cũ sẽ không còn hiệu lực. Bạn có chắc chắn muốn tạo mã mới?</span>,
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
        }
        setLoading(false)
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
    const codesText = backupCodes.join('\n')
    copyToClipboard(codesText)
  }

  const downloadBackupCodes = () => {
    const content = `Mã dự phòng xác thực 2 bước - MySecureApp\nTạo ngày: ${new Date().toLocaleDateString('vi-VN')}\n\n${backupCodes.join(
      '\n'
    )}\n\nLưu ý: Mỗi mã chỉ sử dụng được một lần. Hãy giữ an toàn!`
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
      title: <span className="dark:text-gray-300">Xóa thiết bị tin cậy</span>,
      content: <span className="dark:text-gray-400">Thiết bị này sẽ cần xác thực lại khi đăng nhập lần tiếp theo.</span>,
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
        }
        setLoading(false)
      }
    })
  }

  const setupSteps = [
    {
      title: <span className="dark:text-gray-300">Tải ứng dụng</span>,
      description: <span className="dark:text-gray-400">Tải Google Authenticator hoặc ứng dụng 2FA khác</span>
    },
    {
      title: <span className="dark:text-gray-300">Quét mã QR</span>,
      description: <span className="dark:text-gray-400">Quét mã QR bằng ứng dụng authenticator</span>
    },
    {
      title: <span className="dark:text-gray-300">Xác thực</span>,
      description: <span className="dark:text-gray-400">Nhập mã 6 chữ số từ ứng dụng</span>
    }
  ]

  if (setupStep > 0) {
    return (
      <div className="max-w-[600px] mx-auto p-6">
        <Card className="dark:bg-gray-800">
          <Title level={3} className="dark:text-gray-300">
            Thiết lập xác thực 2 bước
          </Title>
          <Steps current={setupStep - 1} className="mb-6">
            {setupSteps.map((step, index) => (
              <Steps.Step key={index} title={step.title} description={step.description} />
            ))}
          </Steps>

          {setupStep === 1 && (
            <div className="text-center py-6">
              <Alert
                type="info"
                message={<span className="dark:text-gray-300">Bước 1: Tải ứng dụng Authenticator</span>}
                description={
                  <span className="dark:text-gray-300">
                    Bạn cần một ứng dụng authenticator để tạo mã xác thực. Chọn một trong các ứng dụng được khuyến nghị bên dưới.
                  </span>
                }
                className="step-alert dark:bg-slate-500"
              />
              <Paragraph className="dark:text-gray-300">Tải một trong các ứng dụng authenticator sau:</Paragraph>
              <Space direction="vertical" size="middle" className="app-buttons">
                <Button
                  type="primary"
                  icon={<MobileOutlined />}
                  size="large"
                  onClick={() =>
                    window.open('https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2', '_blank')
                  }
                >
                  Google Authenticator
                </Button>
                <Button
                  className="dark:bg-slate-500 dark:hover:!bg-slate-400 dark:text-gray-300 dark:hover:!text-gray-200"
                  icon={<MobileOutlined />}
                  size="large"
                  onClick={() => window.open('https://www.microsoft.com/en-us/security/mobile-authenticator-app', '_blank')}
                >
                  Microsoft Authenticator
                </Button>
                <Button
                  className="dark:bg-slate-500 dark:hover:!bg-slate-400 dark:text-gray-300 dark:hover:!text-gray-200"
                  icon={<MobileOutlined />}
                  size="large"
                  onClick={() => window.open('https://authy.com/', '_blank')}
                >
                  Authy
                </Button>
              </Space>
              <div className="mt-6">
                <Button type="primary" onClick={() => setSetupStep(2)}>
                  Đã tải xong, tiếp tục
                </Button>
              </div>
            </div>
          )}

          {setupStep === 2 && (
            <div className="setup-content">
              <Alert
                type="info"
                message={<span className="dark:text-gray-300">Bước 2: Quét mã QR</span>}
                description={
                  <span className="dark:text-gray-300">Mở ứng dụng authenticator và quét mã QR bên dưới để thêm tài khoản của bạn.</span>
                }
                className="step-alert dark:bg-slate-500"
              />
              <Paragraph className="dark:text-gray-300">Quét mã QR này bằng ứng dụng authenticator của bạn:</Paragraph>
              <div className="my-6 flex justify-center">
                <img src={qrUrl} alt="QR Code" width={200} height={200} />
              </div>
              <Paragraph type="secondary" className="mt-4 dark:text-gray-300">
                Hoặc nhập mã thủ công:
                <br />
                <Text className="dark:text-gray-300" code copyable={{ text: qrSecret }}>
                  {qrSecret}
                </Text>
              </Paragraph>
              <div className="mt-6">
                <Space>
                  <Button
                    className="dark:text-gray-300 dark:bg-slate-500 dark:hover:!bg-slate-400 dark:hover:!text-gray-200"
                    onClick={() => setSetupStep(1)}
                  >
                    Quay lại
                  </Button>
                  <Button type="primary" onClick={() => setSetupStep(3)}>
                    Đã quét xong, tiếp tục
                  </Button>
                </Space>
              </div>
            </div>
          )}

          {setupStep === 3 && (
            <div className="setup-content">
              <Alert
                type="info"
                message={<span className="dark:text-gray-300">Bước 3: Xác thực</span>}
                description={
                  <span className="dark:text-gray-300">Nhập mã 6 chữ số hiển thị trong ứng dụng authenticator để hoàn tất thiết lập.</span>
                }
                className="step-alert dark:bg-slate-500"
              />
              <Form form={form} onFinish={handleVerifyCode}>
                <Paragraph className="dark:text-gray-300">Nhập mã 6 chữ số từ ứng dụng authenticator:</Paragraph>
                <div className="my-6">
                  <Input
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-50 text-center text-lg font-semibold tracking-[4px] dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400"
                    size="large"
                    autoComplete="off"
                  />
                </div>
                <Space className="mt-6">
                  <Button
                    className="dark:bg-slate-500 dark:text-gray-300 dark:hover:!bg-slate-400 dark:hover:!text-gray-200"
                    onClick={() => setSetupStep(2)}
                    disabled={loading}
                  >
                    Quay lại
                  </Button>
                  <Button type="primary" htmlType="submit" disabled={verificationCode.length !== 6} loading={loading}>
                    Hoàn tất thiết lập
                  </Button>
                </Space>
              </Form>
            </div>
          )}

          <div className="mt-6 text-center">
            <Button
              className="dark:text-gray-300 dark:hover:!text-gray-200 dark:hover:!bg-slate-500"
              type="text"
              onClick={() => setSetupStep(0)}
              disabled={loading}
            >
              Hủy thiết lập
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (loading && setupStep === 0) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Paragraph>Đang kiểm tra trạng thái bảo mật...</Paragraph>
      </div>
    )
  }

  return (
    <div className="max-w-[1000px] mx-auto px-6 pb-6">
      <Card
        title={
          <Space className="text-black dark:text-gray-200">
            <SafetyOutlined />
            <span>Xác thực 2 bước (2FA)</span>
          </Space>
        }
        className="mb-6 dark:bg-gray-800"
      >
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <Paragraph type="secondary" className="mb-2 dark:text-gray-200">
              Bật 2FA để tăng cường bảo mật cho tài khoản của bạn. Mỗi lần đăng nhập sẽ cần thêm mã xác thực từ điện thoại.
            </Paragraph>
            <Text type={enabled ? 'success' : 'secondary'} className="flex items-center gap-2">
              {enabled ? (
                <Space>
                  <CheckCircleOutlined />
                  Đã bật - Tài khoản được bảo vệ
                </Space>
              ) : (
                <Space className="text-red-500">
                  <ExclamationCircleOutlined />
                  Đang tắt - Khuyến nghị bật để bảo mật
                </Space>
              )}
            </Text>
          </div>
          <Switch checked={enabled} onChange={handleToggle2FA} size="large" loading={loading} />
        </div>
      </Card>

      {enabled && (
        <div>
          <Card
            className="mb-6 dark:bg-gray-800"
            title={
              <Space className="text-black dark:text-gray-200">
                <KeyOutlined />
                Mã dự phòng
              </Space>
            }
            extra={
              <Button icon={<ReloadOutlined />} onClick={regenerateBackupCodes} type="text" className="text-black dark:text-gray-200">
                Tạo mã mới
              </Button>
            }
          >
            <Paragraph type="secondary" className="dark:text-gray-200">
              Mã dự phòng giúp bạn truy cập tài khoản khi không có thiết bị authenticator. Mỗi mã chỉ sử dụng được một lần.
            </Paragraph>
            <div>
              <Text className="dark:text-gray-200">
                Có{' '}
                <Text strong className="dark:text-gray-200">
                  {backupCodes.length}
                </Text>{' '}
                mã dự phòng có sẵn
              </Text>
              <Button
                type="link"
                icon={showBackupCodes ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                onClick={() => setShowBackupCodes(!showBackupCodes)}
              >
                {showBackupCodes ? 'Ẩn mã' : 'Hiện mã'}
              </Button>
            </div>
            {showBackupCodes && backupCodes.length > 0 && (
              <div>
                {backupCodes.slice(0, 3).map((code, index) => (
                  <Text className="dark:bg-gray-500 dark:text-gray-300" key={index} code>
                    {code}
                  </Text>
                ))}
                {backupCodes.length > 3 && <Text type="secondary">... và {backupCodes.length - 3} mã khác</Text>}
              </div>
            )}
            <Space className="flex flex-col w-full">
              <Button
                className="dark:bg-blue-500 dark:text-gray-200"
                icon={<CopyOutlined />}
                onClick={copyBackupCodes}
                disabled={backupCodes.length === 0}
              >
                Sao chép tất cả
              </Button>
              <Button
                className="dark:bg-blue-500 dark:text-gray-200"
                icon={<DownloadOutlined />}
                onClick={downloadBackupCodes}
                disabled={backupCodes.length === 0}
              >
                Tải xuống
              </Button>
              <Button type="primary" ghost onClick={() => setShowBackupModal(true)} disabled={backupCodes.length === 0}>
                Xem chi tiết
              </Button>
            </Space>
          </Card>

          <Card
            className="dark:bg-gray-800"
            title={
              <Space className="text-black dark:text-gray-200">
                <MobileOutlined />
                Thiết bị tin cậy ({trustedDevices.length})
              </Space>
            }
          >
            <Paragraph className="dark:text-gray-200" type="secondary">
              Các thiết bị đã được xác thực và tin cậy. Bạn có thể xóa thiết bị không còn sử dụng.
            </Paragraph>
            <List
              dataSource={trustedDevices}
              renderItem={device => (
                <List.Item
                  className="py-3 border-b border-solid border-[#f0f0f0] hover:bg-gray-100 dark:hover:bg-gray-700"
                  actions={[
                    !device.current && (
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeDevice(device.deviceId)}>
                        Xóa
                      </Button>
                    )
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text className="dark:text-gray-200" strong>
                          {device.name}
                        </Text>
                        {device.current && <Tag color="green">Thiết bị hiện tại</Tag>}
                      </Space>
                    }
                    description={
                      <div>
                        <div className="dark:text-gray-300">
                          {device.browser} • {device.location}
                        </div>
                        <Text className="dark:text-gray-200" type="secondary">
                          Sử dụng lần cuối: {device.lastUsed ? new Date(device.lastUsed).toLocaleString('vi-VN') : ''}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card
            title={<span className="dark:text-gray-200">Lời khuyên bảo mật</span>}
            className="mt-6 py-3 border-b border-solid border-[#f0f0f0] dark:bg-gray-800"
          >
            <Alert
              className="dark:bg-slate-700"
              type="info"
              message={<span className="dark:text-gray-200">Mẹo bảo mật quan trọng</span>}
              description={
                <ul className="mt-2 ml-4 dark:text-gray-300">
                  <li className='class="mb-1'>Lưu mã dự phòng ở nơi an toàn, tách biệt với thiết bị chính</li>
                  <li className='class="mb-1'>Không bao giờ chia sẻ mã xác thực với bất kỳ ai</li>
                  <li className='class="mb-1'>Định kỳ kiểm tra và xóa các thiết bị không còn sử dụng</li>
                  <li className='class="mb-1'>Chỉ sử dụng ứng dụng authenticator chính thức từ nhà phát triển đáng tin cậy</li>
                  <li className='class="mb-1'>Kích hoạt thông báo đăng nhập để theo dõi hoạt động tài khoản</li>
                </ul>
              }
            />
          </Card>
        </div>
      )}

      <Modal
        title={<span className="dark:text-gray-200">Mã dự phòng xác thực 2 bước</span>}
        open={showBackupModal}
        onCancel={() => setShowBackupModal(false)}
        width={600}
        footer={[
          <Button key="copy" icon={<CopyOutlined />} onClick={copyBackupCodes}>
            Sao chép tất cả
          </Button>,
          <Button key="download" icon={<DownloadOutlined />} onClick={downloadBackupCodes}>
            Tải xuống file
          </Button>,
          <Button key="close" type="primary" onClick={() => setShowBackupModal(false)}>
            Đã lưu an toàn
          </Button>
        ]}
      >
        <Alert
          type="warning"
          message="⚠️ Lưu ý quan trọng"
          description="Hãy lưu những mã này ở nơi an toàn (như password manager hoặc két sắt). Mỗi mã chỉ có thể sử dụng một lần và là cách duy nhất để truy cập tài khoản khi mất thiết bị authenticator."
          className="mb-4"
        />
        <div className="bg-[#f5f5f5] dark:bg-gray-800 p-4 rounded-[6px] text-center">
          {backupCodes.map((code, index) => (
            <div key={index} className="dark:bg-gray-700 font-mono text-base font-semibold py-1 tracking-[2px]">
              <Text code copyable={{ text: code }} className="dark:text-gray-200">
                {code}
              </Text>
            </div>
          ))}
        </div>
        <div>
          <Title className="dark:text-gray-200" level={5}>
            Cách sử dụng mã dự phòng:
          </Title>
          <ol className="dark:text-gray-200">
            <li>Khi đăng nhập, chọn "Sử dụng mã dự phòng" thay vì nhập mã từ app</li>
            <li>Nhập một trong các mã trên</li>
            <li>Mã đã sử dụng sẽ không thể dùng lại</li>
          </ol>
        </div>
      </Modal>
    </div>
  )
}

export default TwoFactorAuthPage
