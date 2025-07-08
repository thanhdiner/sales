import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Typography, Avatar, Upload } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import './AdminAccountsPage.scss'
import { getAdminRoles } from '../../services/rolesService'
const {
  getAdminAccounts,
  createAdminAccount,
  updateAdminAccount,
  deleteAdminAccount,
  changeStatusAdminAccount
} = require('../../services/adminAccountsService')
const { Title } = Typography

const { Option } = Select

function AdminAccountsPage() {
  const [data, setData] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form] = Form.useForm()
  const [oldAvatar, setOldAvatar] = useState('')
  const [avatarToDelete, setAvatarToDelete] = useState('')
  const [isRemoveAvatar, setIsRemoveAvatar] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [accounts, rolesData] = await Promise.all([getAdminAccounts(), getAdminRoles()])
      setData(accounts.data)
      setRoles(rolesData.data)
    } catch (err) {
      message.error('Không thể tải danh sách tài khoản.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    form
      .validateFields()
      .then(async values => {
        setSubmitLoading(true)
        try {
          const formData = new FormData()
          const file = values.avatarUrl?.[0]?.originFileObj
          formData.append('username', values.username)
          formData.append('email', values.email)
          if (!editing) formData.append('password', values.password)
          formData.append('fullName', values.fullName)
          formData.append('role_id', values.role_id)
          formData.append('status', values.status)
          if (file) {
            formData.append('avatarUrl', file)
            if (oldAvatar) formData.append('oldImage', oldAvatar)
          } else {
            if (isRemoveAvatar && editing) {
              formData.append('oldImage', avatarToDelete)
              formData.append('deleteImage', true)
              formData.append('avatarUrl', '')
            }
          }
          if (editing) {
            const res = await updateAdminAccount(editing._id, formData)
            setData(prev => prev.map(acc => (acc._id === res.data._id ? res.data : acc)))
            message.success('Cập nhật tài khoản thành công!')
          } else {
            const res = await createAdminAccount(formData)
            setData(prev => [...prev, res.data])
            message.success('Tạo tài khoản mới thành công!')
          }
          setModalOpen(false)
          setEditing(null)
          setIsRemoveAvatar(false)
          setAvatarToDelete('')
          form.resetFields()
        } catch (e) {
          if (e?.status === 400 && e?.response?.message) message.error(e.response.message)
          else message.error('Failed to save group')
        } finally {
          setSubmitLoading(false)
        }
      })
      .catch(() => setSubmitLoading(false))
  }

  const handleDelete = async id => {
    setLoading(true)
    try {
      await deleteAdminAccount(id)
      setData(prev => prev.filter(acc => acc._id !== id))
      message.success('Đã xoá tài khoản.')
    } catch (e) {
      if (e?.response?.message) message.error(e.response.message)
      else message.error('Xoá thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const openModal = account => {
    setEditing(account)
    setModalOpen(true)
    if (account) {
      setOldAvatar(account.avatarUrl || '')
      form.setFieldsValue({
        ...account,
        avatarUrl: account.avatarUrl
          ? [
              {
                uid: account._id,
                name: account.avatarUrl.split('/').pop(),
                status: 'done',
                url: account.avatarUrl
              }
            ]
          : []
      })
    } else {
      setOldAvatar('')
      form.resetFields()
    }
  }

  const handleChangeStatus = async (id, newStatus) => {
    setLoading(true)
    try {
      await changeStatusAdminAccount(id, newStatus)
      setData(prev => prev.map(acc => (acc._id === id ? { ...acc, status: newStatus } : acc)))
      message.success('Cập nhật trạng thái thành công!')
    } catch (e) {
      if (e?.response?.message) message.error(e.response.message)
      else message.error('Cập nhật trạng thái thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'username',
      className: 'ant-table-cell-style',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            src={record.avatarUrl}
            size={40}
            shape="square"
            style={{
              flexShrink: 0,
              background: '#eee',
              borderRadius: 8,
              width: 40,
              height: 40,
              objectFit: 'cover'
            }}
          >
            {!record.avatarUrl && record.fullName ? record.fullName.trim().split(' ').pop().charAt(0).toUpperCase() : null}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>{record.fullName}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{record.username}</div>
          </div>
        </div>
      )
    },

    { title: 'Email', dataIndex: 'email', className: 'ant-table-cell-style' },
    {
      title: 'Role',
      dataIndex: 'role_id',
      className: 'ant-table-cell-style',
      render: value => {
        const role = roles.find(role => role._id === value)
        return role ? role.label : 'Unknown Role'
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      className: 'ant-table-cell-style',
      render: (value, record) => (
        <Select value={value} style={{ width: 100 }} onChange={newStatus => handleChangeStatus(record._id, newStatus)} size="small">
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
          <Option value="banned">Banned</Option>
        </Select>
      )
    },
    {
      title: 'Action',
      key: 'actions',
      className: 'ant-table-cell-style',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Popconfirm title="Bạn chắc chắn muốn xoá?" onConfirm={() => handleDelete(record._id)} okText="Xoá" cancelText="Huỷ">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Admin Accounts Management
        </Title>
        <Button type="primary" onClick={() => openModal(null)}>
          Thêm tài khoản
        </Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="_id" />
      <Modal
        open={modalOpen}
        title={editing ? 'Sửa tài khoản' : 'Thêm tài khoản'}
        onCancel={() => {
          setModalOpen(false)
          setEditing(null)
          form.resetFields()
        }}
        onOk={handleSave}
        destroyOnClose
        confirmLoading={submitLoading}
        okButtonProps={{ disabled: submitLoading }}
        cancelButtonProps={{ disabled: submitLoading }}
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'active', role_id: 'admin' }}>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, min: 4 },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Chỉ nhập chữ cái, số, hoặc dấu _; không dùng ký tự đặc biệt!' }
            ]}
          >
            <Input autoFocus disabled={!!editing} placeholder="Nhập tên người dùng" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="Nhập email" />
          </Form.Item>
          {!editing && (
            <Form.Item name="password" label="Password" rules={[{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }]}>
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: 'Tên đầy đủ là bắt buộc!' }]}>
            <Input placeholder="Nhập tên đầy đủ" />
          </Form.Item>
          <Form.Item name="role_id" label="Role" rules={[{ required: true }]}>
            <Select>
              {roles.map(role => (
                <Option key={role._id} value={role._id}>
                  {role.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="banned">Banned</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="avatarUrl"
            label="Avatar Image"
            valuePropName="fileList"
            getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              beforeUpload={file => {
                setIsRemoveAvatar(false)
                const isImage = file.type.startsWith('image/')
                if (!isImage) message.error('You can only upload avatar image files!')
                return isImage ? false : Upload.LIST_IGNORE
              }}
              onRemove={file => {
                setAvatarToDelete(oldAvatar)
                setOldAvatar('')
                setIsRemoveAvatar(true)
                return true
              }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Add Avatar</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AdminAccountsPage
