import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, Modal, Space, Table, Tag, Tooltip, Typography, message } from 'antd'
import { Ban, Eye, PackagePlus, Upload } from 'lucide-react'
import {
  createProductCredentials,
  disableProductCredential,
  getProductCredentials,
  revealProductCredential
} from '@/services/adminProductCredentialService'
import './ProductCredentialManager.scss'

const CREDENTIAL_FIELD_ORDER = ['username', 'password', 'email', 'licenseKey', 'loginUrl', 'notes']

const STATUS_META = {
  available: { label: 'Có sẵn', className: 'admin-product-credential__status admin-product-credential__status--available' },
  reserved: { label: 'Đang giữ', className: 'admin-product-credential__status admin-product-credential__status--reserved' },
  sold: { label: 'Đã bán', className: 'admin-product-credential__status admin-product-credential__status--sold' },
  disabled: { label: 'Đã tắt', className: 'admin-product-credential__status admin-product-credential__status--disabled' }
}

const getErrorMessage = (error, fallback) =>
  error?.response?.message || error?.response?.error || error?.message || fallback

const sanitizeCredentialPayload = payload =>
  Object.fromEntries(
    CREDENTIAL_FIELD_ORDER
      .map(field => [field, String(payload?.[field] || '').trim()])
      .filter(([, value]) => value)
  )

const tryParseJson = value => {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

const parseDelimitedCredential = line => {
  const delimiter = ['|', '\t', ','].find(item => line.includes(item))

  if (!delimiter) {
    if (!line.includes('://') && line.split(':').length === 2) {
      const [username, password] = line.split(':')
      return { username, password }
    }

    return { licenseKey: line }
  }

  const parts = line.split(delimiter).map(part => part.trim())
  return Object.fromEntries(CREDENTIAL_FIELD_ORDER.map((field, index) => [field, parts[index] || '']))
}

const parseBulkCredentials = value => {
  const text = String(value || '').trim()
  if (!text) return []

  const parsedJson = tryParseJson(text)
  if (Array.isArray(parsedJson)) {
    return parsedJson.map(sanitizeCredentialPayload).filter(item => Object.keys(item).length > 0)
  }

  if (parsedJson && typeof parsedJson === 'object') {
    const credential = sanitizeCredentialPayload(parsedJson)
    return Object.keys(credential).length ? [credential] : []
  }

  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const parsedLine = line.startsWith('{') ? tryParseJson(line) : null
      return sanitizeCredentialPayload(parsedLine || parseDelimitedCredential(line))
    })
    .filter(item => Object.keys(item).length > 0)
}

export default function ProductCredentialManager({ productId, enabled }) {
  const [form] = Form.useForm()
  const [credentials, setCredentials] = useState([])
  const [availableCount, setAvailableCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [bulkText, setBulkText] = useState('')

  const fetchCredentials = async () => {
    if (!productId || !enabled) return

    setLoading(true)
    try {
      const response = await getProductCredentials(productId)
      setCredentials(response.credentials || [])
      setAvailableCount(response.availableCount || 0)
    } catch (error) {
      message.error(getErrorMessage(error, 'Không tải được kho tài khoản.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCredentials()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, enabled])

  const createCredentials = async payloads => {
    if (!payloads.length) {
      message.warning('Nhập ít nhất một thông tin tài khoản hoặc license.')
      return false
    }

    setSubmitting(true)
    try {
      await createProductCredentials(productId, payloads)
      message.success(`Đã thêm ${payloads.length} tài khoản/license vào kho.`)
      await fetchCredentials()
      return true
    } catch (error) {
      message.error(getErrorMessage(error, 'Thêm credential thất bại.'))
      throw error
    } finally {
      setSubmitting(false)
    }
  }

  const handleAdd = async values => {
    const payload = sanitizeCredentialPayload(values)
    const created = await createCredentials(Object.keys(payload).length ? [payload] : [])
    if (created) form.resetFields()
  }

  const handleBulkAdd = async () => {
    const payloads = parseBulkCredentials(bulkText)
    const created = await createCredentials(payloads)
    if (created) {
      setBulkModalOpen(false)
      setBulkText('')
    }
  }

  const handleReveal = async credentialId => {
    try {
      const response = await revealProductCredential(credentialId)
      const data = response.credential?.data || {}

      Modal.info({
        title: 'Thông tin credential',
        width: 640,
        className: 'admin-product-credential-modal',
        content: (
          <div className="admin-product-credential-modal__content">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="admin-product-credential-modal__row">
                <div className="admin-product-credential-modal__key">{key}</div>
                <Typography.Paragraph className="admin-product-credential-modal__value" copyable>
                  {String(value)}
                </Typography.Paragraph>
              </div>
            ))}
          </div>
        )
      })
    } catch (error) {
      message.error(getErrorMessage(error, 'Không xem được credential.'))
    }
  }

  const handleDisable = credentialId => {
    Modal.confirm({
      className: 'admin-product-credential-modal',
      title: 'Vô hiệu hóa credential này?',
      content: 'Credential đã tắt sẽ không được bán cho đơn mới.',
      okText: 'Vô hiệu hóa',
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: async () => {
        await disableProductCredential(credentialId)
        message.success('Đã vô hiệu hóa credential.')
        fetchCredentials()
      }
    })
  }

  if (!enabled) return null

  const columns = [
    {
      title: 'Thông tin',
      dataIndex: 'summary',
      render: summary => (
        <div className="admin-product-credential__summary">
          <div>Username: {summary?.username || '-'}</div>
          <div>Email: {summary?.email || '-'}</div>
          <div>Key: {summary?.licenseKey || '-'}</div>
          {summary?.loginUrl && <div className="admin-product-credential__summary-url">URL: {summary.loginUrl}</div>}
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      render: status => {
        const statusMeta = STATUS_META[status] || {
          label: status,
          className: 'admin-product-credential__status admin-product-credential__status--disabled'
        }
        return <Tag className={statusMeta.className}>{statusMeta.label}</Tag>
      }
    },
    {
      title: 'Thao tác',
      width: 140,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem credential">
            <Button
              size="small"
              className="admin-product-credential__action-btn"
              icon={<Eye className="h-4 w-4" />}
              onClick={() => handleReveal(record._id)}
            />
          </Tooltip>
          {record.status === 'available' && (
            <Tooltip title="Vô hiệu hóa">
              <Button
                size="small"
                className="admin-product-credential__action-btn admin-product-credential__action-btn--danger"
                icon={<Ban className="h-4 w-4" />}
                onClick={() => handleDisable(record._id)}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ]

  return (
    <Card
      className="admin-product-credential mt-6"
      title={<span className="admin-product-credential__title">Kho tài khoản/license giao ngay</span>}
      extra={<Tag className="admin-product-credential__available-tag">Còn sẵn: {availableCount}</Tag>}
    >
      <Form form={form} layout="vertical" onFinish={handleAdd}>
        <div className="admin-product-credential__grid">
          <Form.Item name="username" label="Username">
            <Input placeholder="username" autoComplete="off" />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input.Password placeholder="password" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="email đăng nhập" autoComplete="off" />
          </Form.Item>
          <Form.Item name="licenseKey" label="License key">
            <Input placeholder="key / mã kích hoạt" autoComplete="off" />
          </Form.Item>
          <Form.Item name="loginUrl" label="Link đăng nhập">
            <Input placeholder="https://..." autoComplete="off" />
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <Input placeholder="ghi chú/hướng dẫn riêng" autoComplete="off" />
          </Form.Item>
        </div>

        <Space wrap>
          <Button
            type="primary"
            className="admin-product-credential__btn admin-product-credential__btn--primary"
            icon={<PackagePlus className="h-4 w-4" />}
            htmlType="submit"
            loading={submitting}
          >
            Thêm vào kho
          </Button>
          <Button
            className="admin-product-credential__btn"
            icon={<Upload className="h-4 w-4" />}
            onClick={() => setBulkModalOpen(true)}
          >
            Nhập hàng loạt
          </Button>
        </Space>
      </Form>

      <Table
        className="admin-product-credential__table mt-5"
        rowKey="_id"
        columns={columns}
        dataSource={credentials}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        className="admin-product-credential-modal"
        title="Nhập hàng loạt"
        open={bulkModalOpen}
        confirmLoading={submitting}
        okText="Thêm vào kho"
        cancelText="Hủy"
        onOk={handleBulkAdd}
        onCancel={() => setBulkModalOpen(false)}
      >
        <Input.TextArea
          className="admin-product-credential-modal__textarea"
          rows={10}
          value={bulkText}
          onChange={event => setBulkText(event.target.value)}
          placeholder={`username|password|email|licenseKey|loginUrl|ghi chú
license-key-only
{"username":"user1","password":"pass1","email":"user1@example.com"}`}
        />
      </Modal>
    </Card>
  )
}
