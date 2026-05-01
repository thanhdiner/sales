import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, Modal, Space, Table, Tag, Tooltip, Typography, message } from 'antd'
import { Ban, Eye, PackagePlus, Upload } from 'lucide-react'
import {
  createProductCredentials,
  disableProductCredential,
  getProductCredentials,
  revealProductCredential
} from '@/services/admin/commerce/productCredential'
import { useTranslation } from 'react-i18next'
import './ProductCredentialManager.scss'

const CREDENTIAL_FIELD_ORDER = ['username', 'password', 'email', 'licenseKey', 'loginUrl', 'notes']

const STATUS_CLASS_NAMES = {
  available: 'admin-product-credential__status admin-product-credential__status--available',
  reserved: 'admin-product-credential__status admin-product-credential__status--reserved',
  sold: 'admin-product-credential__status admin-product-credential__status--sold',
  disabled: 'admin-product-credential__status admin-product-credential__status--disabled'
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
  const { t } = useTranslation('adminProducts')
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
      message.error(getErrorMessage(error, t('credentials.messages.loadError')))
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
      message.warning(t('credentials.messages.missingInput'))
      return false
    }

    setSubmitting(true)
    try {
      await createProductCredentials(productId, payloads)
      message.success(t('credentials.messages.addSuccess', { count: payloads.length }))
      await fetchCredentials()
      return true
    } catch (error) {
      message.error(getErrorMessage(error, t('credentials.messages.addError')))
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
        title: t('credentials.modal.revealTitle'),
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
      message.error(getErrorMessage(error, t('credentials.messages.revealError')))
    }
  }

  const handleDisable = credentialId => {
    Modal.confirm({
      className: 'admin-product-credential-modal',
      title: t('credentials.modal.disableTitle'),
      content: t('credentials.modal.disableContent'),
      okText: t('credentials.modal.disable'),
      okButtonProps: { danger: true },
      cancelText: t('credentials.modal.cancel'),
      onOk: async () => {
        await disableProductCredential(credentialId)
        message.success(t('credentials.messages.disableSuccess'))
        fetchCredentials()
      }
    })
  }

  if (!enabled) return null

  const columns = [
    {
      title: t('credentials.columns.info'),
      dataIndex: 'summary',
      render: summary => (
        <div className="admin-product-credential__summary">
          <div>{t('credentials.summary.username')}: {summary?.username || '-'}</div>
          <div>{t('credentials.summary.email')}: {summary?.email || '-'}</div>
          <div>{t('credentials.summary.key')}: {summary?.licenseKey || '-'}</div>
          {summary?.loginUrl && <div className="admin-product-credential__summary-url">{t('credentials.summary.url')}: {summary.loginUrl}</div>}
        </div>
      )
    },
    {
      title: t('credentials.columns.status'),
      dataIndex: 'status',
      width: 150,
      render: status => {
        const className = STATUS_CLASS_NAMES[status] || STATUS_CLASS_NAMES.disabled
        return <Tag className={className}>{t(`credentials.statuses.${status}`, { defaultValue: status })}</Tag>
      }
    },
    {
      title: t('credentials.columns.actions'),
      width: 140,
      render: (_, record) => (
        <Space>
          <Tooltip title={t('credentials.tooltips.view')}>
            <Button
              size="small"
              className="admin-product-credential__action-btn"
              icon={<Eye className="h-4 w-4" />}
              onClick={() => handleReveal(record._id)}
            />
          </Tooltip>
          {record.status === 'available' && (
            <Tooltip title={t('credentials.tooltips.disable')}>
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
      title={<span className="admin-product-credential__title">{t('credentials.title')}</span>}
      extra={<Tag className="admin-product-credential__available-tag">{t('credentials.availableCount', { count: availableCount })}</Tag>}
    >
      <Form form={form} layout="vertical" onFinish={handleAdd}>
        <div className="admin-product-credential__grid">
          <Form.Item name="username" label={t('credentials.fields.username')}>
            <Input placeholder={t('credentials.fields.usernamePlaceholder')} autoComplete="off" />
          </Form.Item>
          <Form.Item name="password" label={t('credentials.fields.password')}>
            <Input.Password placeholder={t('credentials.fields.passwordPlaceholder')} autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="email" label={t('credentials.fields.email')}>
            <Input placeholder={t('credentials.fields.emailPlaceholder')} autoComplete="off" />
          </Form.Item>
          <Form.Item name="licenseKey" label={t('credentials.fields.licenseKey')}>
            <Input placeholder={t('credentials.fields.licenseKeyPlaceholder')} autoComplete="off" />
          </Form.Item>
          <Form.Item name="loginUrl" label={t('credentials.fields.loginUrl')}>
            <Input placeholder={t('credentials.fields.loginUrlPlaceholder')} autoComplete="off" />
          </Form.Item>
          <Form.Item name="notes" label={t('credentials.fields.notes')}>
            <Input placeholder={t('credentials.fields.notesPlaceholder')} autoComplete="off" />
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
            {t('credentials.buttons.add')}
          </Button>
          <Button
            className="admin-product-credential__btn"
            icon={<Upload className="h-4 w-4" />}
            onClick={() => setBulkModalOpen(true)}
          >
            {t('credentials.buttons.bulk')}
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
        title={t('credentials.modal.bulkTitle')}
        open={bulkModalOpen}
        confirmLoading={submitting}
        okText={t('credentials.modal.addToStock')}
        cancelText={t('credentials.modal.cancel')}
        onOk={handleBulkAdd}
        onCancel={() => setBulkModalOpen(false)}
      >
        <Input.TextArea
          className="admin-product-credential-modal__textarea"
          rows={10}
          value={bulkText}
          onChange={event => setBulkText(event.target.value)}
          placeholder={t('credentials.bulkPlaceholder')}
        />
      </Modal>
    </Card>
  )
}
