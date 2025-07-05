import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, message, Space, Typography, Popconfirm, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ToolOutlined } from '@ant-design/icons'
import './AdminPermissionsPage.scss'
import slugify from 'slugify'
import { createAdminPermissions, deleteAdminPermission, getAdminPermissions, updatePermissionById } from '../../services/permissionService'

const { Title } = Typography

const GROUP_OPTIONS = [
  { label: 'Quản lý sản phẩm', value: 'product' },
  { label: 'Quản lý người dùng', value: 'user' },
  { label: 'Báo cáo & Thống kê', value: 'report' },
  { label: 'Quản trị hệ thống', value: 'system' }
]

export default function AdminPermissionsPage() {
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({ visible: false, editing: null })
  const [form] = Form.useForm()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const res = await getAdminPermissions()
    setPermissions(res.data)
    setLoading(false)
  }

  useEffect(() => {
    if (modal.visible) {
      if (modal.editing) form.setFieldsValue(modal.editing)
      else form.resetFields()
    }
  }, [modal.visible, modal.editing, form])

  const handleCreate = () => {
    setModal({ visible: true, editing: null })
  }

  const handleEdit = item => {
    setModal({ visible: true, editing: item })
  }

  const handleDelete = async item => {
    setLoading(true)
    try {
      await deleteAdminPermission(item._id)
      message.success('Permission deleted!')
      fetchData()
    } catch (e) {
      message.error('Failed to delete permission')
      setLoading(false)
    }
  }

  const handleOk = async () => {
    try {
      const data = await form.validateFields()
      setLoading(true)
      if (modal.editing) {
        await updatePermissionById(modal.editing._id, data)
        message.success('Permission updated!')
      } else {
        await createAdminPermissions(data)
        message.success('Permission created!')
      }
      setModal({ visible: false, editing: null })
      fetchData()
    } catch (e) {
      if (e?.response?.message === 'Created unsuccessful' || e?.response?.message === 'Updated unsuccessful') {
        message.error(e?.response?.message)
      }
    }
    setLoading(false)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: name => <span className="font-semibold">{name}</span>
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
      render: group => <span>{GROUP_OPTIONS.find(opt => opt.value === group)?.label || group}</span>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Are you sure to delete this permission?" onConfirm={() => handleDelete(record)} okText="Yes" cancelText="No">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
      width: 120
    }
  ]

  return (
    <div className="admin-permissions-page">
      <div className="header">
        <Title level={3}>Permissions</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          New Permission
        </Button>
      </div>
      <Table dataSource={permissions} columns={columns} rowKey="_id" bordered loading={loading} pagination={false} />

      <Modal
        title={modal.editing ? 'Edit Permission' : 'Create Permission'}
        open={modal.visible}
        onOk={handleOk}
        onCancel={() => setModal({ visible: false, editing: null })}
        okText={modal.editing ? 'Save' : 'Create'}
        destroyOnClose
      >
        <Form form={form} layout="vertical" autoComplete="off" initialValues={{ name: '', title: '', description: '', group: '' }}>
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Permission title is required' },
              { min: 3, message: 'Permission title must be at least 3 characters' }
            ]}
          >
            <Input
              placeholder="e.g. Quản lý người dùng"
              onChange={e => {
                const newSlug = slugify(e.target.value, { lower: true, strict: true, replacement: '_' })
                if (!modal.editing) form.setFieldsValue({ name: newSlug })
              }}
            />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Permission Name
                {modal.editing && (
                  <Button
                    size="small"
                    type="link"
                    style={{ marginLeft: 8, padding: 0, fontSize: 13 }}
                    onClick={() => {
                      const title = form.getFieldValue('title') || ''
                      const newSlug = slugify(title, { lower: true, strict: true, replacement: '_' })
                      form.setFieldsValue({ name: newSlug })
                    }}
                    icon={<ToolOutlined />}
                  >
                    Generate
                  </Button>
                )}
              </span>
            }
            name="name"
            rules={[
              { required: true, message: 'Permission name is required' },
              { min: 3, message: 'Permission name must be at least 3 characters' },
              { pattern: /^[a-z0-9_]+$/, message: 'Only a-z, 0-9, and _' }
            ]}
          >
            <Input placeholder="e.g. manage_users" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Short description about permission" />
          </Form.Item>
          <Form.Item label="Group" name="group" rules={[{ required: true, message: 'Please select group' }]}>
            <Select placeholder="Select group" options={GROUP_OPTIONS} allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
